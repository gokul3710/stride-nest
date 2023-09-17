import { IsOptional } from 'class-validator';

export class TrackingDto {
  @IsOptional()
  placed?: Date | false | string;

  @IsOptional()
  packed?: Date | false | string;

  @IsOptional()
  shipped?: Date | false | string;

  @IsOptional()
  arrived?: Date | false | string;

  @IsOptional()
  delivered?: Date | false | string;

  @IsOptional()
  returned?: Date | false | string;

  @IsOptional()
  cancelled?: Date | false | string;
}
