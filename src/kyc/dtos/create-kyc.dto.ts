import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KycType } from '../../common/enums';

export class CreateKycDto {
  @IsEnum(KycType)
  type: KycType;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  documentFront?: string;
  @IsOptional()
  @IsString()
  documentBack?: string;
}
