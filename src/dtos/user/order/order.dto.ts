import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserAddressDto } from './user-address.dto';
import { OrderItemDto } from './order-item.dto';
import { TrackingDto } from './tracking-dto';
import { PaymentDto } from './payment.dto';

export class OrderDto {
  @IsOptional()
  _id?: ObjectId | string;

  @IsOptional()
  userId?: ObjectId | string;

  @ValidateNested()
  @Type(() => UserAddressDto)
  deliveryAddress: UserAddressDto;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => TrackingDto)
  tracking: TrackingDto;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto | ObjectId;

  @IsIn([
    'pending',
    'placed',
    'packed',
    'shipped',
    'arrived',
    'delivered',
    'returned',
    'cancelled',
  ])
  status: statusModel;

  @IsNumber()
  @Min(0)
  total: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  discount: number;
}

export type statusModel =
  | 'pending'
  | 'placed'
  | 'packed'
  | 'shipped'
  | 'arrived'
  | 'delivered'
  | 'returned'
  | 'cancelled';
