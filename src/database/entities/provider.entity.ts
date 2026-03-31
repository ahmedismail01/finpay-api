import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('provider')
export class Provider extends BaseEntity {
  @Column({ unique: true })
  name: string;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
