import { ObjectId } from 'mongodb';

export interface UserDocument extends Document {
  _id: ObjectId | string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  image: string;
  password: string;
  username: string;
  gender: 'Male' | 'Female';
  notifications: number;
  block?: boolean;
}
