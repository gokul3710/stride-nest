import { ObjectId } from 'mongodb';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsBoolean,
  IsIn,
  Length,
} from 'class-validator';

export class UserAddressDto {
  @IsOptional()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;

  @IsNotEmpty()
  @IsString()
  house: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  @IsIn(['India'])
  country: 'India';

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  pincode: string;

  @IsOptional()
  @IsString()
  landmark?: string;
}
