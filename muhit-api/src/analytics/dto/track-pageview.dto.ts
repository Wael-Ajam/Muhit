import { IsString, IsOptional } from 'class-validator';

export class TrackPageviewDto {
  @IsString()
  page: string;

  @IsString()
  @IsOptional()
  referrer?: string;
}
