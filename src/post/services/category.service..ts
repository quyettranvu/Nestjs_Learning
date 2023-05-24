import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAll() {
    return await this.categoryRepository.getByCondition({});
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.create(createCategoryDto);
  }

  async getPosts(category_id) {
    return await this.categoryRepository.getByCondition({
      //match documents in the array(categories) where at least one element there equals to category_id
      categories: { $elemMatch: { $eq: category_id } },
    });
  }
}
