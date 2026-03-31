import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { KycStatus, KycType } from '../../common/enums';
import { User } from '../../user/entities/user.entity';
import type { Relation } from 'typeorm';

@Entity('kyc')
export class Kyc extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'enum', enum: KycType })
  type: KycType;

  @Column({ nullable: true })
  details: string;

  @Column({ nullable: true })
  documentFront: string;

  @Column({ nullable: true })
  documentBack: string;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'rejected_by' })
  rejectedBy: User;

  @Column({ nullable: true })
  reasonOfRejection: string;
}
