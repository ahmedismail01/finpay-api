import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { KycStatus } from '../../common/enums';
import { PaginationBaseDto } from '../../common/dtos/pagination-base.dto';

export class KycQueryDto {
  @IsOptional()
  @IsNumber()
  id?: string;
  @IsOptional()
  @IsUUID()
  userId?: string;
  @IsOptional()
  @IsEnum(KycStatus)
  status?: KycStatus;
}

export class KycListQueryDto extends PaginationBaseDto {
  @IsOptional()
  @IsUUID()
  id?: string;
  @IsOptional()
  @IsNumber()
  userId?: string;
  @IsOptional()
  @IsEnum(KycStatus)
  status?: KycStatus;
}
