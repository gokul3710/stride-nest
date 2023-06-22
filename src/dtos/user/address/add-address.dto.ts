import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class addAddressDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IN')
  @Length(10,10)
  @Matches(/^\d+$/, {
    message: 'Phone number must contain only numbers',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(3)
  street: string;

  @IsNotEmpty()
  @IsString()
  house: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(6,6)
  @Matches(/^\d+$/, {
    message: 'Pincode must contain only numbers',
  })
  pincode: string;

  @IsOptional()
  @IsString()
  landmark: string;

  @IsOptional()
  @IsIn(['India'])
  country: 'India'

  @IsOptional()
  @IsBoolean()
  default: boolean
}
