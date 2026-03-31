import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import type { Relation } from 'typeorm';
import { Provider } from 'src/database/entities/provider.entity';
@Entity('payments')
export class Payment extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Relation<Wallet>;
  @OneToOne(() => Transaction, (transaction) => transaction.payment)
  transaction: Relation<Transaction>;
  @Column('json')
  log: any;
  @Column()
  status: string;
  @Column({ type: 'bigint', default: 0 })
  amountInCents: number;
  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'provider_id' })
  provider: Relation<Provider>;
}
