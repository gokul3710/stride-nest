import { ObjectId } from 'mongodb';
import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsOptional()
  _id?: ObjectId;

  @IsNotEmpty()
  brand: any;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  material: string;

  @IsNotEmpty()
  @IsString()
  style: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;
}
