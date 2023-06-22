import { IsNotEmpty, IsString, Length } from 'class-validator';

export class passwordChangeDto {
  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  newPassword: string;
}
