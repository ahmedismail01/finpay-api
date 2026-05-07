import { IsNumber, IsString, IsUUID, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../../common/enums';

export class CreateTransactionDto {
  @IsNumber()
  walletId: number;

  @IsNumber()
  @Min(1)
  amountInCents: number;

  @IsString()
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  idempotencyKey: string;
}
