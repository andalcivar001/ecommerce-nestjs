import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AddressModule } from './address/address.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'am05',
      database: 'ecommerce',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // esto es para que tome todos los archivos .entity.ts del proyecto y se creen las tablas de la base de datos
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    ProductsModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
