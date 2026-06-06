import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateWalletDto {
  @IsUUID()
  currencyId: string;

  @IsNumber()
  @Min(0)
  initialBalance?: number = 0;
}
