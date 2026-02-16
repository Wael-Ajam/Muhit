import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(category?: string, published?: string): Promise<({
        tags: {
            id: number;
            tagKey: string;
        }[];
        gallery: {
            id: number;
            sortOrder: number;
            type: string;
            src: string;
            layout: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        websiteUrl: string | null;
        slug: string;
        category: string;
        coverImage: string;
        coverVideo: string | null;
        isVideo: boolean;
        sortOrder: number;
        titleAr: string;
        titleEn: string;
        descAr: string;
        descEn: string;
        longDescAr: string;
        longDescEn: string;
        isPublished: boolean;
        isFeatured: boolean;
        storyP2Ar: string;
        storyP2En: string;
        storyP3Ar: string;
        storyP3En: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        tags: {
            id: number;
            tagKey: string;
        }[];
        gallery: {
            id: number;
            sortOrder: number;
            type: string;
            src: string;
            layout: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        websiteUrl: string | null;
        slug: string;
        category: string;
        coverImage: string;
        coverVideo: string | null;
        isVideo: boolean;
        sortOrder: number;
        titleAr: string;
        titleEn: string;
        descAr: string;
        descEn: string;
        longDescAr: string;
        longDescEn: string;
        isPublished: boolean;
        isFeatured: boolean;
        storyP2Ar: string;
        storyP2En: string;
        storyP3Ar: string;
        storyP3En: string;
    }>;
    exportForFrontend(): Promise<{
        projects: {
            id: number;
            slug: string;
            category: string;
            image: string;
            video: string | null;
            isVideo: boolean;
            titleKey: string;
            descKey: string;
            longDescKey: string;
            storyPara2Key: string;
            storyPara3Key: string;
            tagKeys: string[];
            websiteUrl: string | undefined;
            gallery: {
                type: string;
                src: string;
                layout: string;
                width: number;
                height: number;
                aspectRatio: number;
            }[];
        }[];
        messages: {
            ar: Record<string, string>;
            en: Record<string, string>;
        };
    }>;
    findOne(id: number): Promise<{
        tags: {
            id: number;
            tagKey: string;
        }[];
        gallery: {
            id: number;
            sortOrder: number;
            type: string;
            src: string;
            layout: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        websiteUrl: string | null;
        slug: string;
        category: string;
        coverImage: string;
        coverVideo: string | null;
        isVideo: boolean;
        sortOrder: number;
        titleAr: string;
        titleEn: string;
        descAr: string;
        descEn: string;
        longDescAr: string;
        longDescEn: string;
        isPublished: boolean;
        isFeatured: boolean;
        storyP2Ar: string;
        storyP2En: string;
        storyP3Ar: string;
        storyP3En: string;
    }>;
    create(createProjectDto: CreateProjectDto): Promise<{
        tags: {
            id: number;
            tagKey: string;
        }[];
        gallery: {
            id: number;
            sortOrder: number;
            type: string;
            src: string;
            layout: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        websiteUrl: string | null;
        slug: string;
        category: string;
        coverImage: string;
        coverVideo: string | null;
        isVideo: boolean;
        sortOrder: number;
        titleAr: string;
        titleEn: string;
        descAr: string;
        descEn: string;
        longDescAr: string;
        longDescEn: string;
        isPublished: boolean;
        isFeatured: boolean;
        storyP2Ar: string;
        storyP2En: string;
        storyP3Ar: string;
        storyP3En: string;
    }>;
    reorder(orderedIds: number[]): Promise<{
        message: string;
    }>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<{
        tags: {
            id: number;
            tagKey: string;
        }[];
        gallery: {
            id: number;
            sortOrder: number;
            type: string;
            src: string;
            layout: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        websiteUrl: string | null;
        slug: string;
        category: string;
        coverImage: string;
        coverVideo: string | null;
        isVideo: boolean;
        sortOrder: number;
        titleAr: string;
        titleEn: string;
        descAr: string;
        descEn: string;
        longDescAr: string;
        longDescEn: string;
        isPublished: boolean;
        isFeatured: boolean;
        storyP2Ar: string;
        storyP2En: string;
        storyP3Ar: string;
        storyP3En: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    addGalleryItem(id: number, dto: CreateGalleryItemDto): Promise<{
        id: number;
        sortOrder: number;
        type: string;
        src: string;
        layout: string;
        width: number;
        height: number;
        aspectRatio: number;
        projectId: number;
    }>;
    removeGalleryItem(id: number, itemId: number): Promise<{
        message: string;
    }>;
    reorderGallery(id: number, orderedIds: number[]): Promise<{
        message: string;
    }>;
}
