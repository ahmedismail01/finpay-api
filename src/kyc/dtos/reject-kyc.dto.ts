import { IsString } from 'class-validator';

export class RejectKycDto {
  @IsString()
  reasonOfRejection: string;
}
