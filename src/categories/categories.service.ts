import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import uploadFile from 'src/utils/cloud_storage';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoriesRepository.find();
  }

  async create(file: Express.Multer.File, category: CreateCategoryDto) {
    const url = await uploadFile(file, file.originalname);

    if (!url) {
      throw new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    category.image = url;
    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(category);
  }

  async updateWithImage(
    file: Express.Multer.File,
    id: number,
    category: UpdateCategoryDto,
  ) {
    const url = await uploadFile(file, file.originalname);

    if (!url) {
      throw new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
    if (!categoryFound) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }
    category.image = url;
    const updatedCategory = Object.assign(categoryFound, category);
    return this.categoriesRepository.save(updatedCategory);
  }

  async update(id: number, category: UpdateCategoryDto) {
    console.log('id', id);
    console.log('category', category);
    const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
    if (!categoryFound) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }
    category.image = categoryFound.image;
    const updatedCategory = Object.assign(categoryFound, category);
    return this.categoriesRepository.save(updatedCategory);
  }

  async delete(id: number) {
    const categoryFound = await this.categoriesRepository.findOneBy({ id: id });
    if (!categoryFound) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }

    return this.categoriesRepository.delete(id);
  }
}
