import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { KycStatus } from '../../common/enums';
import { PaginationBaseDto } from '../../common/dtos/pagination-base.dto';

export class KycQueryDto extends PaginationBaseDto {
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
