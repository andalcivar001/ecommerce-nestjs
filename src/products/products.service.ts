import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CraeteProductDto } from './dto/create-product-dto';
import asyncForEach from 'src/utils/async_foreach';
import uploadFile from 'src/utils/cloud_storage';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  findAll() {
    return this.productsRepository.find();
  }

  findByCategory(id_category: number) {
    return this.productsRepository.findBy({ id_category: id_category });
  }

  async create(files: Array<Express.Multer.File>, product: CraeteProductDto) {
    if (files.length == 0) {
      throw new HttpException(
        'Las imagenes son obligatorias',
        HttpStatus.BAD_REQUEST,
      );
    }
    let uploadFiles = 0; // contar cuantos archivos se han subido a firebase
    const newProduct = this.productsRepository.create(product);
    const savedProduct = await this.productsRepository.save(newProduct);

    const startForEach = async () => {
      await asyncForEach(files, async (file: Express.Multer.File) => {
        const url = await uploadFile(file, file.originalname);
        if (url) {
          if (uploadFiles === 0) {
            savedProduct.image1 = url;
          } else if (uploadFiles === 1) {
            savedProduct.image2 = url;
          }
        }
        await this.update(savedProduct.id, savedProduct);
        uploadFiles = uploadFiles + 1;

        // if (uploadFiles === files.length) {
        //   return savedProduct;
        // }
      });
    };
    await startForEach();
    return savedProduct;
  }
  async updateWithImages(
    files: Array<Express.Multer.File>,
    id: number,
    product: UpdateProductDto,
  ) {
    if (files.length == 0) {
      throw new HttpException(
        'Las imagenes son obligatorias',
        HttpStatus.BAD_REQUEST,
      );
    }
    let counter = 0;
    let iamgeToUpdate = JSON.parse(product.image_to_update!);
    let uploadFiles = iamgeToUpdate[counter]; // contar cuantos archivos se han subido a firebase
    const updateProduct = await this.update(id, product);

    const startForEach = async () => {
      await asyncForEach(files, async (file: Express.Multer.File) => {
        const url = await uploadFile(file, file.originalname);
        if (url) {
          if (uploadFiles === 0) {
            updateProduct.image1 = url;
          } else if (uploadFiles === 1) {
            updateProduct.image2 = url;
          }
        }
        await this.update(id, updateProduct);
        counter++;
        uploadFiles = Number(product.image_to_update![counter]);

        // if (uploadFiles === files.length) {
        //   return savedProduct;
        // }
      });
    };
    await startForEach();
    return updateProduct;
  }

  async update(id: number, product: UpdateProductDto) {
    try {
      const productFound = await this.productsRepository.findOneBy({ id: id });
      if (!productFound) {
        throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
      }
      const updatedProduct = Object.assign(productFound, product);
      return this.productsRepository.save(updatedProduct);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el producto ${error.message}`,
      );
    }
  }

  async delete(id: number) {
    console.log('id DELETE', id);
    try {
      const productFound = await this.productsRepository.findOneBy({ id: id });
      if (!productFound) {
        throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
      }
      return this.productsRepository.delete(productFound);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el producto ${error.message}`,
      );
    }
  }
}
