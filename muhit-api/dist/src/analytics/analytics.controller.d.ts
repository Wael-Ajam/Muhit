import { AnalyticsService } from './analytics.service';
import { TrackPageviewDto } from './dto/track-pageview.dto';
import { TrackClickDto } from './dto/track-click.dto';
import type { Request } from 'express';
export declare class AnalyticsController {
    private analytics;
    constructor(analytics: AnalyticsService);
    trackPageview(dto: TrackPageviewDto, req: Request): Promise<{
        ok: boolean;
    }>;
    trackClick(dto: TrackClickDto, req: Request): Promise<{
        ok: boolean;
    }>;
    getSummary(period?: string): Promise<{
        totalViews: number;
        totalClicks: number;
        uniquePages: number;
        topPage: string;
        viewsChange: number;
        clicksChange: number;
        engagementRate: number;
    }>;
    getPageviews(period?: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getClicks(period?: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getTopPages(period?: string): Promise<{
        page: string;
        count: number;
    }[]>;
    getTopButtons(period?: string): Promise<{
        buttonId: string;
        label: string;
        count: number;
    }[]>;
    getDevices(period?: string): Promise<{
        device: string;
        count: number;
        percentage: number;
    }[]>;
    getCountries(period?: string): Promise<{
        country: string | null;
        count: number;
        percentage: number;
    }[]>;
    private detectDevice;
    private detectCountry;
}
