import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRolDto {
  // los nombres de estos campos deben ser exactamente igual a los campos en la BD, respetar mayusculas y minusculas
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  route: string;
}
