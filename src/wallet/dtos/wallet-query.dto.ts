import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class WalletQueryDto {
  @IsOptional()
  @IsUUID()
  currencyId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
