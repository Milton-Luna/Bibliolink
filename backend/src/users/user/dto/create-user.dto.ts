import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  user_password: string;

  @IsNotEmpty()
  @IsInt()
  rol_id: number;
}