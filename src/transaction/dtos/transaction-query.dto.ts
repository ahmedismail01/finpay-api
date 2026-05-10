import { IsOptional, IsUUID, IsEnum, IsNumber, Min } from 'class-validator';
import { TransactionType } from '../../common/enums';
import { PaginationBaseDto } from '../../common/dtos/pagination-base.dto';

export class TransactionQueryDto extends PaginationBaseDto {
  @IsOptional()
  @IsUUID()
  walletId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
