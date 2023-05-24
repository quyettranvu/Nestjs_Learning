import { Schema, Document } from 'mongoose';
import { Post } from './post.model';

//Aggregation returns only secret id: _id(from Document)
export interface Category extends Document {
  title: string;
  posts: [Post];
}

const CategorySchema = new Schema<Category>(
  {
    title: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  },

  {
    timestamps: true,
    collection: 'categories',
  },
);

export { CategorySchema };
