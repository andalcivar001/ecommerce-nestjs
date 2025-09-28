import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol-dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
  ) {}

  async create(rol: CreateRolDto): Promise<Rol> {
    try {
      const newRol = this.rolesRepository.create(rol);
      return await this.rolesRepository.save(newRol);
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo crear el rol ' + error.message,
      );
    }
  }
}
