import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import uploadFile from 'src/utils/cloud_storage';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';

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
}
