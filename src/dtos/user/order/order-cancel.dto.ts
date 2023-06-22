import { IsNotEmpty, IsString } from 'class-validator';

export class OrderCancelDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
