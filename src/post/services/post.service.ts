import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostRepository } from '../repository/post.repository';
import { User } from 'src/user/models/user.model';
import { CategoryRepository } from '../repository/category.repository';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllPosts(page: number, limit: number, start: string) {
    const count = await this.postRepository.countDocument({});
    const count_page = (count / limit).toFixed();
    const posts = await this.postRepository.getByCondition(
      //By combining start and (skip, limit) we can enhance efficiency in case of big db
      {
        _id: {
          $gt: isValidObjectId(start) ? start : '000000000000000000000000',
        },
      },
      null,
      {
        sort: {
          _id: 1, //ascending order, if -1  -> descending order
        },
        skip: (page - 1) * limit,
        limit: Number(limit),
      },
    );
    return { count_page, posts };
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post
        // await post.populate({ path: 'user', select: '-password' });
        // .populate({ path: 'user', select: 'name email' });
        // .populate('categories')
        .populate([
          { path: 'user', select: 'name email' },
          {
            path: 'categories',
            match: {
              _id: '644c6285c29df572b790a16c',
            },
            select: 'title',
            options: { limit: 100, sort: { name: 1 } },
            // populate: [{
            // path: ''
            // }]
          },
        ]);
      //populate method for retrieving related documents from other collections(if they have relationship)
      return post;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async replacePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByIdAndUpdate(post_id, data);
  }

  async createPost(user: User, post: CreatePostDto) {
    post.user = user._id;
    const new_post = await this.postRepository.create(post);
    if (post.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }

    return new_post;
  }

  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }

  async getByCategory(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: { $elemMatch: { $eq: category_id } },
    });
  }

  async getByCategories(category_ids: [string]) {
    return await this.postRepository.getByCondition({
      categories: { $all: category_ids },
    });
  }

  async getByArray() {
    return await this.postRepository.getByCondition({
      // 'numbers.0': { $eq: 10 },
      // numbers: { $elemMatch: { $gt: 13, $lt: 20 } },
      // $or: [{ numbers: { $gt: 14 } }, { numbers: { $lt: 22 } }],
      // numbers: { $gt: 15, $lt: 16 },
      // tags: 'black',
      // tags: { $all: ['black', 'blank'] },
      // tags: ['red', 'black'],
      // tags: { $size: 4 },
      tags: { $exists: false },
    });
  }
}
