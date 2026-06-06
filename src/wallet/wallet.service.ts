import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { User } from '../user/entities/user.entity';
import { Currency } from '../database/entities/currency.entity';
import { WalletQueryDto } from './dtos/wallet-query.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async getWallet(query: WalletQueryDto): Promise<Wallet | null> {
    const existingWallet = await this.walletRepository.findOne({
      where: query,
    });
    return existingWallet;
  }

  async createWallet(user: User, dto: CreateWalletDto): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingWallet) {
      throw new BadRequestException('User already has a wallet');
    }

    const currency = await this.currencyRepository.findOneBy({
      id: dto.currencyId,
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    const wallet = this.walletRepository.create({
      user,
      currency,
      balanceInCents: dto.initialBalance || 0,
      isActive: true,
    });

    return this.walletRepository.save(wallet);
  }

  async getWalletByUser(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'currency'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getWalletById(walletId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['user', 'currency'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async updateBalance(
    walletId: string,
    amountInCents: number,
  ): Promise<Wallet> {
    const wallet = await this.getWalletById(walletId);

    if (!wallet.isActive) {
      throw new ForbiddenException('Wallet is suspended');
    }

    const newBalance = wallet.balanceInCents + amountInCents;

    if (newBalance < 0) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balanceInCents = newBalance;
    return this.walletRepository.save(wallet);
  }

  async suspendWallet(
    walletId: string,
    suspendedBy: User,
    reason: string,
  ): Promise<Wallet> {
    const wallet = await this.getWalletById(walletId);

    wallet.isActive = false;
    wallet.suspendedBy = suspendedBy;
    wallet.reasonOfSuspension = reason;

    return this.walletRepository.save(wallet);
  }

  async activateWallet(walletId: string): Promise<Wallet> {
    const wallet = await this.getWalletById(walletId);

    wallet.isActive = true;
    wallet.suspendedBy = null;
    wallet.reasonOfSuspension = null;

    return this.walletRepository.save(wallet);
  }

  async getAllWallets(limit: number = 10, offset: number = 0) {
    const [wallets, total] = await this.walletRepository.findAndCount({
      relations: ['user', 'currency'],
      take: limit,
      skip: offset,
    });

    return { wallets, total };
  }
}
