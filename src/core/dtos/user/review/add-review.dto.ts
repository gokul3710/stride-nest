import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class addReviewDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  rating: string;

  @IsNotEmpty()
  @IsString()
  review: string;
}
