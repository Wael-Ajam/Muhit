import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    trackPageview(data: {
        page: string;
        referrer?: string;
        userAgent?: string;
        ip?: string;
        device?: string;
        country?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        userAgent: string | null;
        page: string;
        referrer: string | null;
        ip: string | null;
        country: string | null;
        device: string;
    }>;
    trackClick(data: {
        buttonId: string;
        page: string;
        label?: string;
        ip?: string;
        device?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        page: string;
        ip: string | null;
        device: string;
        buttonId: string;
        label: string | null;
    }>;
    private getDateFrom;
    getSummary(period: string): Promise<{
        totalViews: number;
        totalClicks: number;
        uniquePages: number;
        topPage: string;
        viewsChange: number;
        clicksChange: number;
        engagementRate: number;
    }>;
    getPageviews(period: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getClicks(period: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getTopPages(period: string): Promise<{
        page: string;
        count: number;
    }[]>;
    getTopButtons(period: string): Promise<{
        buttonId: string;
        label: string;
        count: number;
    }[]>;
    getDevices(period: string): Promise<{
        device: string;
        count: number;
        percentage: number;
    }[]>;
    getCountries(period: string): Promise<{
        country: string | null;
        count: number;
        percentage: number;
    }[]>;
}
