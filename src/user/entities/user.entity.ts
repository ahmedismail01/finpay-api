import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../common/enums';
import { Kyc } from '../../kyc/entities/kyc.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import type { Relation } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;
  @Column()
  @Exclude()
  password: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  phoneNumber: string;
  @Column({ nullable: true })
  @Exclude()
  resetPasswordToken: string;
  @Column({ nullable: true })
  @Exclude()
  resetPasswordExpire: Date;
  @Column({ default: false })
  isActive: boolean;
  @Column({ default: false })
  isVerified: boolean;
  @Column({ enum: Role, default: Role.USER, type: 'enum' })
  role: Role;
  @OneToMany(() => Kyc, (kyc) => kyc.user)
  kycs: Relation<Kyc[]>;
  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;
}
