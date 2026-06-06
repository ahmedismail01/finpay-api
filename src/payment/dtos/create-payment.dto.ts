import { IsNumber, IsUUID, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  walletId: string;

  @IsNumber()
  @Min(1)
  amountInCents: number;

  @IsUUID()
  providerId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
