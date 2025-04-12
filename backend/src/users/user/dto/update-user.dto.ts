import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  user_email?: string;

  @IsOptional()
  @MinLength(6)
  user_password?: string;
}