import { IsOptional, IsUUID, IsString, IsNumber, Min } from 'class-validator';
import { PaginationBaseDto } from '../../common/dtos/pagination-base.dto';
export class PaymentQueryDto extends PaginationBaseDto {
  @IsOptional()
  @IsUUID()
  walletId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
