import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class WalletQueryDto {
  @IsOptional()
  @IsNumber()
  currencyId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
