import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';
import { Rol } from 'src/roles/rol.entity';
import { RolesService } from 'src/roles/roles.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' }, // s=segundos, h=horas, d=dias, si se borra el contenido de los {} el token nunca expira
    }),
  ],

  providers: [AuthService, RolesService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
