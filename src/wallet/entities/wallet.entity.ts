import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Currency } from '../../database/entities/currency.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ name: 'currency_id', type: 'uuid' })
  currencyId: string;

  @Column({ type: 'bigint', default: 0 })
  balanceInCents: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, { nullable: true })
  suspendedBy: User | null;

  @Column({ type: 'varchar', nullable: true })
  reasonOfSuspension: string | null;
}
