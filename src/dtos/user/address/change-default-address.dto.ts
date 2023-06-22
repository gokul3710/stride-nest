import { IsNotEmpty, IsString } from 'class-validator';

export class changeDefaultAddressDto {
  @IsNotEmpty()
  @IsString()
  current: string;

  @IsNotEmpty()
  @IsString()
  new: string;
}
