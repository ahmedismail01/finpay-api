import {
  BadRequestException,
  Injectable,
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
import { KycQueryDto } from './dtos/kyc-query.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc) private readonly kycRepository: Repository<Kyc>,
    private readonly userService: UserService,
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

  async rejectKyc(kycId: number, rejectKycDto: RejectKycDto) {
    const kyc = await this.kycRepository.findOne({ where: { id: kycId } });
    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }
    kyc.status = KycStatus.REJECTED;
    kyc.reasonOfRejection = rejectKycDto.reasonOfRejection;
    await this.kycRepository.save(kyc);
    return kyc;
  }

  async verifyKyc(userId: number) {
    const kyc = await this.kycRepository.findOne({ where: { userId } });
    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }
    kyc.status = KycStatus.APPROVED;
    await this.kycRepository.save(kyc);
    await this.userService.update(kyc.userId, { isVerified: true });
    return kyc;
  }
}
