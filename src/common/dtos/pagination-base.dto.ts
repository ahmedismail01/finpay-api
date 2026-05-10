import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationBaseDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  get offset() {
    return (this.page - 1) * this.limit;
  }
}
