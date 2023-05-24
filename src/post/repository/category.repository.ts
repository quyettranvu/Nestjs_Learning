import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from 'src/base.repository';
import { Category } from '../models/category.model.';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepository extends BaseRepository<Category & Document> {
  //using decorator @Inject to inject model
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category & Document>,
  ) {
    super(categoryModel);
  }
}
