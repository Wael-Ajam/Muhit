export declare class CreateProjectDto {
    slug: string;
    category: string;
    coverImage: string;
    coverVideo?: string;
    isVideo?: boolean;
    websiteUrl?: string;
    sortOrder?: number;
    isPublished?: boolean;
    isFeatured?: boolean;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    longDescAr?: string;
    longDescEn?: string;
    storyP2Ar?: string;
    storyP2En?: string;
    storyP3Ar?: string;
    storyP3En?: string;
    tags?: string[];
}
