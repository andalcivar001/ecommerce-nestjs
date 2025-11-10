import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { Product } from './product.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy],
})
export class ProductsModule {}
