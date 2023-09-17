import { Document, ObjectId } from 'mongodb';

export interface ProductDocument extends Document {
  _id?: ObjectId;
  brand: string;
  model: string;
  description: string;
  color: string;
  size: number;
  price: number;
  material: string;
  style: string;
  year: number;
  images: string[];
  stock: number;
}
