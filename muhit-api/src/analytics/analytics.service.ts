import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // ── Track ──

  async trackPageview(data: {
    page: string;
    referrer?: string;
    userAgent?: string;
    ip?: string;
    device?: string;
    country?: string;
  }) {
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

  async trackClick(data: {
    buttonId: string;
    page: string;
    label?: string;
    ip?: string;
    device?: string;
  }) {
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

  // ── Query helpers ──

  private getDateFrom(period: string): Date {
    const now = new Date();
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }

  // ── Summary ──

  async getSummary(period: string) {
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

    // Previous period for comparison
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
      engagementRate:
        totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0,
    };
  }

  // ── Daily page views ──

  async getPageviews(period: string) {
    const dateFrom = this.getDateFrom(period);
    const views = await this.prisma.pageView.findMany({
      where: { createdAt: { gte: dateFrom } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const dailyMap = new Map<string, number>();
    views.forEach((v) => {
      const day = v.createdAt.toISOString().slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    });

    // Fill missing days
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const result: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, count: dailyMap.get(key) || 0 });
    }
    return result;
  }

  // ── Daily clicks ──

  async getClicks(period: string) {
    const dateFrom = this.getDateFrom(period);
    const clicks = await this.prisma.buttonClick.findMany({
      where: { createdAt: { gte: dateFrom } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, number>();
    clicks.forEach((c) => {
      const day = c.createdAt.toISOString().slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
    });

    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const result: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, count: dailyMap.get(key) || 0 });
    }
    return result;
  }

  // ── Top pages ──

  async getTopPages(period: string) {
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

  // ── Top buttons ──

  async getTopButtons(period: string) {
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

  // ── Device breakdown ──

  async getDevices(period: string) {
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

  // ── Country breakdown ──

  async getCountries(period: string) {
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
  // ── Reset all analytics ──

  async resetAll() {
    const [deletedViews, deletedClicks] = await this.prisma.$transaction([
      this.prisma.pageView.deleteMany(),
      this.prisma.buttonClick.deleteMany(),
    ]);
    return {
      deletedViews: deletedViews.count,
      deletedClicks: deletedClicks.count,
    };
  }
}
