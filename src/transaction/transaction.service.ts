import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Wallet } from '../wallet/entities/wallet.entity';
import { WalletService } from '../wallet/wallet.service';
import { TransactionQueryDto } from './dtos/transaction-query.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private walletService: WalletService,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    // Check for duplicate transaction using idempotency key
    const existingTransaction = await this.transactionRepository.findOne({
      where: { idempotencyKey: dto.idempotencyKey },
    });

    if (existingTransaction) {
      return existingTransaction;
    }

    const wallet = await this.walletService.getWalletById(dto.walletId);

    if (!wallet.isActive) {
      throw new ForbiddenException('Wallet is suspended');
    }

    // Validate balance for withdrawals
    if (
      (dto.type === 'withdrawal' || dto.type === 'transfer_out') &&
      wallet.balanceInCents < dto.amountInCents
    ) {
      throw new BadRequestException('Insufficient balance');
    }

    // Determine amount change based on transaction type
    let amountChange = 0;
    if (dto.type === 'deposit' || dto.type === 'transfer_in') {
      amountChange = dto.amountInCents;
    } else if (dto.type === 'withdrawal' || dto.type === 'transfer_out') {
      amountChange = -dto.amountInCents;
    }

    // Update wallet balance
    const updatedWallet = await this.walletService.updateBalance(
      dto.walletId,
      amountChange,
    );

    // Create transaction
    const transaction = this.transactionRepository.create({
      wallet,
      amountInCents: dto.amountInCents,
      type: dto.type,
      description: dto.description,
      idempotencyKey: dto.idempotencyKey,
      balanceAfterTransactionInCents: updatedWallet.balanceInCents,
    });

    return this.transactionRepository.save(transaction);
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['wallet', 'payment'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getWalletTransactions(walletId: number, query: TransactionQueryDto) {
    // Verify wallet exists
    await this.walletService.getWalletById(walletId);

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { wallet: { id: walletId } },
        relations: ['wallet', 'payment'],
        order: { createdAt: 'DESC' },
        take: query.limit,
        skip: query.offset,
      },
    );

    return { transactions, total };
  }

  async getAllTransactions(query: TransactionQueryDto) {
    const { limit, offset, page, ...filters } = query;
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: filters,
        relations: ['wallet', 'payment'],
        order: { createdAt: 'DESC' },
        take: query.limit,
        skip: query.offset,
      },
    );

    return { transactions, total };
  }

  async getTransactionsByType(type: string, query: TransactionQueryDto) {
    const { offset, limit } = query;
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { type },
        relations: ['wallet', 'payment'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      },
    );

    return { transactions, total };
  }
}
