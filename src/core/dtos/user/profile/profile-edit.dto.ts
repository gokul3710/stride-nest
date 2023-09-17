import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class profileEditDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z]+$/, {
    message: 'First name must contain only alphabetic characters',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z]+$/, {
    message: 'Last name must contain only alphabetic characters',
  })
  lastName: string;
}
