import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('currency')
export class Currency extends BaseEntity {
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  code: string;
  @Column()
  symbol: string;
}
