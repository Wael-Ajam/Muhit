import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  slug: string;

  @IsString()
  category: string;

  @IsString()
  coverImage: string;

  @IsOptional()
  @IsString()
  coverVideo?: string;

  @IsOptional()
  @IsBoolean()
  isVideo?: boolean;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  // Bilingual content
  @IsString()
  titleAr: string;

  @IsString()
  titleEn: string;

  @IsString()
  descAr: string;

  @IsString()
  descEn: string;

  @IsOptional()
  @IsString()
  longDescAr?: string;

  @IsOptional()
  @IsString()
  longDescEn?: string;

  @IsOptional()
  @IsString()
  storyP2Ar?: string;

  @IsOptional()
  @IsString()
  storyP2En?: string;

  @IsOptional()
  @IsString()
  storyP3Ar?: string;

  @IsOptional()
  @IsString()
  storyP3En?: string;

  // Tags
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
