import { IsNotEmpty, IsString } from 'class-validator';

export class userLoginDto {
  @IsNotEmpty()
  @IsString()
  credential: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
