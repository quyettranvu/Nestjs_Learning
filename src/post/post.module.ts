import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repository/post.repository';
import { CategorySchema } from './models/category.model.';
import { CategoryController } from './controllers/category.controller.';
import { CategoryRepository } from './repository/category.repository';
import { CategoryService } from './services/category.service.';
import { UserModule } from 'src/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './handler/createPost.handler';
import { GetPostHandler } from './handler/getPost.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
    UserModule,
    CqrsModule,
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    PostRepository,
    CategoryRepository,
    CategoryService,
    CreatePostHandler,
    GetPostHandler,
  ], //add PostRepository to ensure that it mapped to BaseRepository(since it was injected with model)
})
export class PostModule {}
