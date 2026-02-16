import { IsString, IsOptional } from 'class-validator';

export class TrackClickDto {
  @IsString()
  buttonId: string;

  @IsString()
  page: string;

  @IsString()
  @IsOptional()
  label?: string;
}
