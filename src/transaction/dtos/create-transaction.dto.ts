import { IsNumber, IsString, IsUUID, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../../common/enums';

export class CreateTransactionDto {
  @IsUUID()
  walletId: string;

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
