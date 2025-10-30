import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class UpdateCategoryDto {
  name?: string;

  description?: string;

  image?: string;

  user_modified?: string;
}
