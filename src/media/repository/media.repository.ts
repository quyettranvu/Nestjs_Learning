import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from '../models/media.model';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class MediaRepository extends BaseRepository<Media & Document> {
  constructor(
    @InjectModel('Media')
    private readonly mediaModel: Model<Media & Document>,
  ) {
    super(mediaModel);
  }
}
