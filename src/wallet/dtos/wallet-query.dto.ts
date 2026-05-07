import { IsOptional, IsUUID } from 'class-validator';

export class WalletQueryDto {
  @IsOptional()
  @IsUUID()
  currencyId?: string;
}
