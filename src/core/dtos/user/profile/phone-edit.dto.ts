import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class phoneEditDto {
  @IsNotEmpty()
  @IsString()
  @Length(10)
  @Matches(/^\d+$/, {
    message: 'Phone number must contain only numbers',
  })
  phone: string;
}
