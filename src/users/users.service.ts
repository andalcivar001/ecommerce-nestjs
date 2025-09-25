import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  async update(id: number, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOneBy({ id: id });
    if (!userFound) {
      return new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    if (user.phone != userFound.phone) {
      const phoneFound = await this.userRepository.findOneBy({
        phone: user.phone,
      });
      if (phoneFound) {
        return new HttpException('Telefono ya existe', HttpStatus.CONFLICT);
      }
    }

    const updateUser = Object.assign(userFound, user);
    const res = await this.userRepository.save(updateUser);
    return res;
  }

  async updateWithImage(image: Express.Multer.File) {}
}
