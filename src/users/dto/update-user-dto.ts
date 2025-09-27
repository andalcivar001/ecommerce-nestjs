import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  name?: string;
  lastName?: string;
  phone?: string;
  image?: string;
  notificacionToken?: string;
}
