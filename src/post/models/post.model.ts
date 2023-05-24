import { Schema, Document } from 'mongoose';
import { User } from 'src/user/models/user.model';
import { Category } from './category.model.';

//Aggregation returns only secret id: _id(from Document)
export interface Post extends Document {
  title: string;
  description: string;
  content: string;
  user: User;
  tags: [string];
  numbers: [number];
  categories: [Category];
}

const PostSchema = new Schema<Post>(
  {
    title: String,
    description: String,
    content: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', //point to model User
    },
    tags: [String],
    numbers: [Number],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },

  {
    timestamps: true,
    collection: 'posts',
  },
);

export { PostSchema };
