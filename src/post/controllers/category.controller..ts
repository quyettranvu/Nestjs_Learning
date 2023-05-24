import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CategoryService } from '../services/category.service.';
import { CreateCategoryDto } from '../dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //routes
  @Get()
  getAllCategories() {
    return this.categoryService.getAll();
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  //Each post can belong to many categories and many posts can belong to one category
  @Get(':id/posts')
  getAllPostsOf(@Param('id') category_id: string) {
    return this.categoryService.getPosts(category_id);
  }
}
