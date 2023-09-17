import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class addToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsNumber()
  count?: number;
}
