import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        slug: string;
        sortOrder: number;
        nameAr: string;
        nameEn: string;
    }[]>;
    create(data: {
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
    update(id: number, data: {
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
