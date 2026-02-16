import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        nameAr: string;
        nameEn: string;
    }[]>;
    create(dto: {
        slug: string;
        nameAr: string;
        nameEn: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        nameAr: string;
        nameEn: string;
    }>;
    update(id: number, dto: {
        slug?: string;
        nameAr?: string;
        nameEn?: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        nameAr: string;
        nameEn: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        nameAr: string;
        nameEn: string;
    }>;
}
