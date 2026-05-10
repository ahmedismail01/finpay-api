import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { Provider } from '../database/entities/provider.entity';
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from '../transaction/transaction.service';
import { PaymentQueryDto } from './dtos/payment-query.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    private walletService: WalletService,
    private transactionService: TransactionService,
  ) {}

  async createPayment(user: User, dto: CreatePaymentDto): Promise<Payment> {
    // Verify wallet belongs to user
    const wallet = await this.walletRepository.findOne({
      where: { id: dto.walletId, user: { id: user.id } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Verify provider exists
    const provider = await this.providerRepository.findOneBy({
      id: dto.providerId,
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Create payment record
    const payment = this.paymentRepository.create({
      user,
      wallet,
      provider,
      amountInCents: dto.amountInCents,
      status: 'pending',
      log: {
        createdAt: new Date(),
        description: dto.description || '',
      },
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Create corresponding transaction
    const transaction = this.transactionRepository.create({
      wallet,
      amountInCents: dto.amountInCents,
      type: 'deposit',
      description: `Payment from ${provider.name}`,
      idempotencyKey: `payment-${savedPayment.id}`,
      payment: savedPayment,
      balanceAfterTransactionInCents: wallet.balanceInCents,
    });

    savedPayment.transaction =
      await this.transactionRepository.save(transaction);

    return this.paymentRepository.save(savedPayment);
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['user', 'wallet', 'provider', 'transaction'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getUserPayments(userId: number, limit: number = 10, page: number = 1) {
    const offset = (page - 1) * limit;
    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'wallet', 'provider', 'transaction'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { payments, total };
  }

  async getWalletPayments(walletId: number, query: PaymentQueryDto) {
    const { offset, limit } = query;
    // Verify wallet exists
    await this.walletService.getWalletById(walletId);

    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { wallet: { id: walletId } },
      relations: ['user', 'wallet', 'provider', 'transaction'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { payments, total };
  }

  async getAllPayments(query: PaymentQueryDto) {
    const { page, limit, offset, ...filters } = query;
    const [payments, total] = await this.paymentRepository.findAndCount({
      where: filters,
      relations: ['user', 'wallet', 'provider', 'transaction'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { payments, total };
  }

  async updatePaymentStatus(
    paymentId: number,
    status: string,
    log?: any,
  ): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);

    payment.status = status;
    if (log) {
      payment.log = { ...payment.log, ...log, updatedAt: new Date() };
    }

    return this.paymentRepository.save(payment);
  }

  async refundPayment(paymentId: number): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);

    if (payment.status === 'refunded') {
      throw new BadRequestException('Payment is already refunded');
    }

    if (payment.status !== 'succeeded') {
      throw new BadRequestException('Only succeeded payments can be refunded');
    }

    // Reverse the transaction
    const reversalTransaction = this.transactionRepository.create({
      wallet: payment.wallet,
      amountInCents: payment.amountInCents,
      type: 'withdrawal',
      description: `Refund for payment ${paymentId}`,
      idempotencyKey: `refund-${paymentId}`,
      balanceAfterTransactionInCents: payment.wallet.balanceInCents,
    });

    await this.transactionRepository.save(reversalTransaction);

    // Update wallet balance
    await this.walletService.updateBalance(
      payment.wallet.id,
      -payment.amountInCents,
    );

    // Update payment status
    return this.updatePaymentStatus(paymentId, 'refunded', {
      refundedAt: new Date(),
    });
  }
}
