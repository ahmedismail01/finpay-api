import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsPhoneNumber()
  phoneNumber: string;
  @IsString({})
  password: string;
}
