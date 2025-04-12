import { IsNotEmpty } from 'class-validator';

export class CreateRolDto {
  @IsNotEmpty()
  rol_name: string;
}
