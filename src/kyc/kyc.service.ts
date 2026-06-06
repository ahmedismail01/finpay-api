import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Kyc } from './entities/kyc.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKycDto } from './dtos/create-kyc.dto';
import { RejectKycDto } from './dtos/reject-kyc.dto';
import { UserService } from '../user/user.service';
import { KycStatus } from '../common/enums';
import { User } from '../user/entities/user.entity';
import { KycListQueryDto, KycQueryDto } from './dtos/kyc-query.dto';
import { WalletService } from '../wallet/wallet.service';
import { Currency } from '../database/entities/currency.entity';
import {
  createPaginatedResponse,
  PaginatedResponse,
} from '../common/utils/pagination.helper';
import { DataSource } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc)
    private readonly kycRepository: Repository<Kyc>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly dataSource: DataSource,
  ) {}

  async createKyc(createKycDto: CreateKycDto, user: Partial<User>) {
    const existingKyc = await this.kycRepository.findOne({
      where: { userId: user.id },
    });
    if (existingKyc?.status == KycStatus.PENDING) {
      throw new BadRequestException('Pending KYC already exists for this user');
    }

    if (existingKyc?.status == KycStatus.APPROVED) {
      throw new BadRequestException(
        'Approved KYC already exists for this user',
      );
    }

    return this.kycRepository.save({ ...createKycDto, userId: user.id });
  }

  async getKyc(query: KycQueryDto): Promise<Kyc | null> {
    const kyc = await this.kycRepository.findOne({ where: query });
    return kyc;
  }

  async getKycs(query: KycListQueryDto): Promise<PaginatedResponse<Kyc[]>> {
    const { offset, limit, page, ...filters } = query;
    const [records, total] = await this.kycRepository.findAndCount({
      where: filters,
      skip: offset,
      take: limit,
    });

    return createPaginatedResponse(records, total, page, limit);
  }

  async rejectKyc(kycId: string, rejectKycDto: RejectKycDto, admin: User) {
    const kyc = await this.kycRepository.findOne({
      where: { id: kycId },
    });
    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }
    kyc.status = KycStatus.REJECTED;
    kyc.reasonOfRejection = rejectKycDto.reasonOfRejection;
    await this.kycRepository.save(kyc);
    const userWallet = await this.walletService.getWallet({
      userId: kyc.user.id,
    });
    if (userWallet?.isActive) {
      await this.walletService.suspendWallet(
        userWallet.id,
        admin,
        'kyc rejected',
      );
    }

    return kyc;
  }

  async verifyKyc(kycId: string): Promise<Kyc> {
    return this.dataSource.transaction(async (manager) => {
      const kyc = await manager.findOne(Kyc, {
        where: { id: kycId },
      });

      if (!kyc) {
        throw new NotFoundException('KYC not found');
      }

      if (kyc.status === KycStatus.APPROVED) {
        throw new BadRequestException('KYC already approved');
      }

      let currency = await manager.findOne(Currency, {
        where: { isDefault: true },
      });

      if (!currency) {
        currency = await manager.findOne(Currency, {
          where: {},
        });
      }

      if (!currency) {
        throw new InternalServerErrorException('No Currency Found');
      }

      kyc.status = KycStatus.APPROVED;
      await manager.save(kyc);

      await manager.update(User, { id: kyc.userId }, { isVerified: true });

      const wallet = await manager.findOne(Wallet, {
        where: { userId: kyc.userId },
      });

      if (!wallet) {
        const newWallet = manager.create(Wallet, {
          userId: kyc.userId,
          currencyId: currency.id,
          balance: 0,
        });

        await manager.save(newWallet);
      }

      return kyc;
    });
  }
}
