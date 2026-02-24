// Shared types matching NestJS API response shapes

export interface ApiProject {
  id: number;
  slug: string;
  category: string;
  coverImage: string;
  coverVideo: string | null;
  logo: string | null;
  isVideo: boolean;
  websiteUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;

  // Bilingual content
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  longDescAr: string;
  longDescEn: string;
  storyP2Ar: string;
  storyP2En: string;
  storyP3Ar: string;
  storyP3En: string;

  // Relations
  tags: ApiProjectTag[];
  gallery: ApiGalleryItem[];
  categories: ApiProjectCategory[];

  createdAt: string;
  updatedAt: string;
}

export interface ApiProjectTag {
  id: number;
  tagKey: string;
}

export interface ApiProjectCategory {
  id: number;
  categorySlug: string;
  category?: { nameAr: string; nameEn: string };
}

export interface ApiGalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  layout: string;
  sortOrder: number;
  width: number;
  height: number;
  aspectRatio: number;
}

// Helper to get localized text from an API project
export function localize(
  project: ApiProject,
  field: 'title' | 'desc' | 'longDesc' | 'storyP2' | 'storyP3',
  locale: string,
): string {
  const suffix = locale === 'ar' ? 'Ar' : 'En';
  const key = `${field}${suffix}` as keyof ApiProject;
  return (project[key] as string) || '';
}
