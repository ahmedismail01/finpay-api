import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { KycStatus } from '../../common/enums';

export class KycQueryDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsOptional()
  @IsNumber()
  userId?: number;
  @IsOptional()
  @IsEnum(KycStatus)
  status?: KycStatus;
}
