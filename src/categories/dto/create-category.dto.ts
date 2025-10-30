import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  image: string;

  user_created: string;
}
