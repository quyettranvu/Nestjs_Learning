import { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}

const UserSchema = new Schema<User>(
  {
    name: String,
    email: String,
    password: String,
    refreshToken: String,
  },

  {
    collection: 'users', //name in MongoDB
  },
);

//Virtual Schema (relationship 1-many: justOne = false, 1-1: justOne-true)
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id', //in model User
  foreignField: 'user', //in model Post,
  justOne: false,
  // count: true, //get number of posts
  match: {
    categories: { $size: 2 },
  },
});

export { UserSchema };
