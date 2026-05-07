import { IsNumber, IsUUID, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  walletId: number;

  @IsNumber()
  @Min(1)
  amountInCents: number;

  @IsNumber()
  providerId: number;

  @IsOptional()
  @IsString()
  description?: string;
}
