import { IsNotEmpty, IsString, Length } from 'class-validator';

export class usernameEditDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  username: string;
}
