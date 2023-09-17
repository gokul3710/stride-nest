import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class editCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}
