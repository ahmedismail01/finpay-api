import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationBaseDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  get offset() {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
