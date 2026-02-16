import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateGalleryItemDto {
  @IsString()
  type: string; // 'image' | 'video'

  @IsString()
  src: string;

  @IsOptional()
  @IsString()
  layout?: string; // 'landscape' | 'portrait' | 'square'

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsInt()
  width?: number;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsNumber()
  aspectRatio?: number;
}
