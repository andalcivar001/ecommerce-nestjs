import { IsNotEmpty, isNotEmpty, IsString, isString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  id_user: number;
}
