import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<Record<string, string>>;
    get(key: string): Promise<string | null>;
    bulkUpsert(settings: {
        key: string;
        value: string;
    }[]): Promise<Record<string, string>>;
}
