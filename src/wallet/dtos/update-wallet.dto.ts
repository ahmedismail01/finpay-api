import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  reasonOfSuspension?: string;
}
