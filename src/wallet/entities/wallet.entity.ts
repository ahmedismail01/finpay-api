import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Currency } from 'src/database/entities/currency.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column({ type: 'bigint', default: 0 })
  balanceInCents: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, { nullable: true })
  suspendedBy: User;

  @Column({ nullable: true })
  reasonOfSuspension: string;
}
