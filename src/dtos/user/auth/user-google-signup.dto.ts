import { IsNotEmpty, IsPhoneNumber, IsString, Length, Matches } from 'class-validator';

export class userGoogleSignupDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('IN')
  @Length(10,10)
  @Matches(/^\d+$/, {
    message: 'Pincode must contain only numbers',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  gender: 'Male' | 'Female';

  @IsNotEmpty()
  @IsString()
  password: string;
}
