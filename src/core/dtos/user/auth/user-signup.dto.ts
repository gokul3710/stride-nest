import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class userSignupDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(/^\S+@\S+\.\S+$/, {
    message: 'Invalid email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IN')
  @Length(10, 10)
  @Matches(/^\d+$/, {
    message: 'Phone number must contain only numbers',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  gender: 'Male' | 'Female';

  @IsNotEmpty()
  @IsString()
  password: string;
}
