import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  currencyId: number;

  @IsNumber()
  @Min(0)
  initialBalance?: number = 0;
}
