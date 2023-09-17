import { ObjectId } from 'mongodb';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsIn,
  IsDate,
  IsNumber,
} from 'class-validator';

export class PaymentDto {
  @IsOptional()
  _id?: ObjectId;

  @IsOptional()
  userId?: ObjectId | string;

  @IsNotEmpty()
  @IsIn(['PAYPAL', 'RAZORPAY', 'COD'])
  method: 'PAYPAL' | 'RAZORPAY' | 'COD';

  @IsNotEmpty()
  @IsIn(['paid', 'pending', 'failed', 'refunded'])
  status: 'paid' | 'pending' | 'failed' | 'refunded';

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsIn(['INR'])
  currency: 'INR';

  @IsNotEmpty()
  date: Date | string | false;
}
