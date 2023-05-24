import { Injectable } from '@nestjs/common';
import { Post } from '../models/post.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class PostRepository extends BaseRepository<Post & Document> {
  //using decorator @Inject to inject model
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<Post & Document>,
  ) {
    super(postModel);
  }

  async countDocument(filter) {
    return this.postModel.countDocuments(filter);
  }
}
