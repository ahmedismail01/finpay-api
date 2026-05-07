import { IsOptional, IsUUID, IsEnum, IsNumber, Min } from 'class-validator';
import { TransactionType } from '../../common/enums';

export class TransactionQueryDto {
  @IsOptional()
  @IsUUID()
  walletId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
