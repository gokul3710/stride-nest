import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class userGoogleSigninDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(/^\S+@\S+\.\S+$/, {
    message: 'Ivalid email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsString()
  photoURL: string;
}
