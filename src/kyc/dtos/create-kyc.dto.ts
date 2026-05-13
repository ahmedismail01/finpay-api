import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KycType } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKycDto {
  @IsEnum(KycType)
  type: KycType;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', format: 'binary' })
  documentFront?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', format: 'binary' })
  documentBack?: string;
}
