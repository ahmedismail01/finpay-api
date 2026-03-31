import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role, TransactionType } from '../../common/enums';
import type { Relation } from 'typeorm';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Payment } from 'src/payment/entities/payment.entity';
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

  @OneToOne(() => Payment, (payment) => payment.transaction)
  payment: Relation<Payment>;
}
