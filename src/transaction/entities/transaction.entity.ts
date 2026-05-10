import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role, TransactionType } from '../../common/enums';
import type { Relation } from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Payment } from '../../payment/entities/payment.entity';
@Entity('transactions')
export class Transaction extends BaseEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.id)
  wallet: Relation<Wallet>;

  @Column({ type: 'bigint', default: 0 })
  amountInCents: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  balanceAfterTransactionInCents: number;

  @Column({ unique: true })
  idempotencyKey: string;

  @Column({ type: 'int', name: 'payment_id', nullable: true })
  paymentId: number | null;

  @OneToOne(() => Payment, (payment) => payment.transaction)
  @JoinColumn({ name: 'payment_id' })
  payment: Relation<Payment>;
}
