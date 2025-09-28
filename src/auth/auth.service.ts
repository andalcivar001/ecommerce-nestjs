import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Rol) private rolRepository: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterAuthDto) {
    const emailExists = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (emailExists) {
      // El error 409 es un conflicto
      return new HttpException('El email ya existe', HttpStatus.CONFLICT);
    }

    const phoneExists = await this.userRepository.findOneBy({
      phone: user.phone,
    });
    if (phoneExists) {
      return new HttpException('El telefono ya existe', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(user);
    const rolesIds = user.rolesIds;
    const roles = await this.rolRepository.findBy({ id: In(rolesIds) });
    newUser.roles = roles;

    const userSaved = await this.userRepository.save(newUser);
    const rolesIdsString = userSaved.roles.map((rol) => rol.id);
    const payload = {
      id: userSaved.id,
      name: userSaved.name,
      roles: rolesIdsString,
    };
    const token = this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = userSaved;

    const data = {
      user: userWithoutPassword,
      token: 'Bearer ' + token,
    };
    return data;
  }

  async login(loginData: LoginAuthDto) {
    const email = loginData.email;
    const pwd = loginData.password;
    const userFound = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['roles'], // aqui va el mismo campo que tiene en user.entity
    });

    if (!userFound) {
      return new HttpException(
        'El usuario no esta registrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPwdValid = await compare(pwd, userFound.password);
    if (!isPwdValid) {
      return new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.FORBIDDEN,
      );
    }

    const rolesId = userFound.roles.map((rol) => rol.id);
    const payload = { id: userFound.id, name: userFound.name, roles: rolesId };
    const token = this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = userFound;
    const data = {
      user: userWithoutPassword,
      token: 'Bearer ' + token,
    };
    return data;
  }
}
