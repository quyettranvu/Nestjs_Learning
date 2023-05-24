import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<User & Document> {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User & Document>,
  ) {
    super(userModel);
  }
}
