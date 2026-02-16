"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackPageview(data) {
        return this.prisma.pageView.create({
            data: {
                page: data.page,
                referrer: data.referrer || null,
                userAgent: data.userAgent || null,
                ip: data.ip || null,
                country: data.country || null,
                device: data.device || 'desktop',
            },
        });
    }
    async trackClick(data) {
        return this.prisma.buttonClick.create({
            data: {
                buttonId: data.buttonId,
                page: data.page,
                label: data.label || null,
                ip: data.ip || null,
                device: data.device || 'desktop',
            },
        });
    }
    getDateFrom(period) {
        const now = new Date();
        const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    async getSummary(period) {
        const dateFrom = this.getDateFrom(period);
        const [totalViews, totalClicks, uniquePages, topPage] = await Promise.all([
            this.prisma.pageView.count({ where: { createdAt: { gte: dateFrom } } }),
            this.prisma.buttonClick.count({ where: { createdAt: { gte: dateFrom } } }),
            this.prisma.pageView.groupBy({
                by: ['page'],
                where: { createdAt: { gte: dateFrom } },
            }),
            this.prisma.pageView.groupBy({
                by: ['page'],
                where: { createdAt: { gte: dateFrom } },
                _count: { page: true },
                orderBy: { _count: { page: 'desc' } },
                take: 1,
            }),
        ]);
        const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
        const prevFrom = new Date(dateFrom.getTime() - days * 24 * 60 * 60 * 1000);
        const [prevViews, prevClicks] = await Promise.all([
            this.prisma.pageView.count({
                where: { createdAt: { gte: prevFrom, lt: dateFrom } },
            }),
            this.prisma.buttonClick.count({
                where: { createdAt: { gte: prevFrom, lt: dateFrom } },
            }),
        ]);
        const viewsChange = prevViews > 0
            ? Math.round(((totalViews - prevViews) / prevViews) * 100)
            : 0;
        const clicksChange = prevClicks > 0
            ? Math.round(((totalClicks - prevClicks) / prevClicks) * 100)
            : 0;
        return {
            totalViews,
            totalClicks,
            uniquePages: uniquePages.length,
            topPage: topPage[0]?.page || '-',
            viewsChange,
            clicksChange,
            engagementRate: totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0,
        };
    }
    async getPageviews(period) {
        const dateFrom = this.getDateFrom(period);
        const views = await this.prisma.pageView.findMany({
            where: { createdAt: { gte: dateFrom } },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        const dailyMap = new Map();
        views.forEach((v) => {
            const day = v.createdAt.toISOString().slice(0, 10);
            dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
        });
        const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().slice(0, 10);
            result.push({ date: key, count: dailyMap.get(key) || 0 });
        }
        return result;
    }
    async getClicks(period) {
        const dateFrom = this.getDateFrom(period);
        const clicks = await this.prisma.buttonClick.findMany({
            where: { createdAt: { gte: dateFrom } },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        const dailyMap = new Map();
        clicks.forEach((c) => {
            const day = c.createdAt.toISOString().slice(0, 10);
            dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
        });
        const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().slice(0, 10);
            result.push({ date: key, count: dailyMap.get(key) || 0 });
        }
        return result;
    }
    async getTopPages(period) {
        const dateFrom = this.getDateFrom(period);
        const pages = await this.prisma.pageView.groupBy({
            by: ['page'],
            where: { createdAt: { gte: dateFrom } },
            _count: { page: true },
            orderBy: { _count: { page: 'desc' } },
            take: 10,
        });
        return pages.map((p) => ({ page: p.page, count: p._count.page }));
    }
    async getTopButtons(period) {
        const dateFrom = this.getDateFrom(period);
        const buttons = await this.prisma.buttonClick.groupBy({
            by: ['buttonId', 'label'],
            where: { createdAt: { gte: dateFrom } },
            _count: { buttonId: true },
            orderBy: { _count: { buttonId: 'desc' } },
            take: 10,
        });
        return buttons.map((b) => ({
            buttonId: b.buttonId,
            label: b.label || b.buttonId,
            count: b._count.buttonId,
        }));
    }
    async getDevices(period) {
        const dateFrom = this.getDateFrom(period);
        const devices = await this.prisma.pageView.groupBy({
            by: ['device'],
            where: { createdAt: { gte: dateFrom } },
            _count: { device: true },
        });
        const total = devices.reduce((acc, d) => acc + d._count.device, 0);
        return devices.map((d) => ({
            device: d.device,
            count: d._count.device,
            percentage: total > 0 ? Math.round((d._count.device / total) * 100) : 0,
        }));
    }
    async getCountries(period) {
        const dateFrom = this.getDateFrom(period);
        const countries = await this.prisma.pageView.groupBy({
            by: ['country'],
            where: {
                createdAt: { gte: dateFrom },
                country: { not: null },
            },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 20,
        });
        const total = countries.reduce((acc, c) => acc + c._count.country, 0);
        return countries.map((c) => ({
            country: c.country,
            count: c._count.country,
            percentage: total > 0 ? Math.round((c._count.country / total) * 100) : 0,
        }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map