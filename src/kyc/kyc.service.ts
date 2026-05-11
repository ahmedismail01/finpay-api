import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Kyc } from './entities/kyc.entity';
import { Repository, Transaction } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKycDto } from './dtos/create-kyc.dto';
import { RejectKycDto } from './dtos/reject-kyc.dto';
import { UserService } from '../user/user.service';
import { KycStatus } from '../common/enums';
import { User } from '../user/entities/user.entity';
import { KycQueryDto } from './dtos/kyc-query.dto';
import { WalletService } from '../wallet/wallet.service';
import { Currency } from '../database/entities/currency.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc)
    private readonly kycRepository: Repository<Kyc>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  async createKyc(createKycDto: CreateKycDto, user: Partial<User>) {
    const existingKyc = await this.kycRepository.findOne({
      where: { userId: user.id },
    });
    if (existingKyc) {
      throw new BadRequestException('KYC already exists for this user');
    }
    return this.kycRepository.save({ ...createKycDto, userId: user.id });
  }

  async getKyc(query: KycQueryDto) {
    const records = await this.kycRepository.find({ where: query });
    if (records.length === 0) {
      throw new NotFoundException('KYC not found');
    }
    return records;
  }

  async rejectKyc(kycId: number, rejectKycDto: RejectKycDto, admin: User) {
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

  async verifyKyc(kycId: number) {
    const kyc = await this.kycRepository.findOne({ where: { id: kycId } });
    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }

    if (kyc.status === KycStatus.APPROVED) {
      throw new BadRequestException('KYC already approved');
    }
    kyc.status = KycStatus.APPROVED;
    await this.kycRepository.save(kyc);
    const user = await this.userService.update(kyc.userId, {
      isVerified: true,
    });

    let currency = await this.currencyRepository.findOne({
      where: { isDefault: true },
    });

    if (!currency) {
      currency = await this.currencyRepository.findOne({});
    }

    if (!currency) {
      throw new InternalServerErrorException('No Currency Found');
    }

    const userWallet = await this.walletService.getWallet({ userId: user.id });

    if (!userWallet) {
      await this.walletService.createWallet(user, {
        currencyId: currency.id,
        initialBalance: 0.0,
      });
    }

    return kyc;
  }
}
