import { IsNotEmpty, IsString } from 'class-validator';

export class userSigninDto {
  @IsNotEmpty()
  @IsString()
  credential: string;
}
