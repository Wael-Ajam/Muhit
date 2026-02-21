import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackPageviewDto } from './dto/track-pageview.dto';
import { TrackClickDto } from './dto/track-click.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  // ── Public tracking endpoints ──

  @Post('pageview')
  async trackPageview(@Body() dto: TrackPageviewDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '';
    const device = this.detectDevice(userAgent);

    // Detect country from IP (non-blocking)
    const country = await this.detectCountry(ip);

    await this.analytics.trackPageview({
      page: dto.page,
      referrer: dto.referrer,
      userAgent,
      ip,
      device,
      country,
    });

    return { ok: true };
  }

  @Post('click')
  async trackClick(@Body() dto: TrackClickDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || '';
    const device = this.detectDevice(userAgent);

    await this.analytics.trackClick({
      buttonId: dto.buttonId,
      page: dto.page,
      label: dto.label,
      ip,
      device,
    });

    return { ok: true };
  }

  // ── Admin-only query endpoints ──

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  getSummary(@Query('period') period = '7d') {
    return this.analytics.getSummary(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pageviews')
  getPageviews(@Query('period') period = '7d') {
    return this.analytics.getPageviews(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('clicks')
  getClicks(@Query('period') period = '7d') {
    return this.analytics.getClicks(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-pages')
  getTopPages(@Query('period') period = '7d') {
    return this.analytics.getTopPages(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-buttons')
  getTopButtons(@Query('period') period = '7d') {
    return this.analytics.getTopButtons(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('devices')
  getDevices(@Query('period') period = '7d') {
    return this.analytics.getDevices(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('countries')
  getCountries(@Query('period') period = '7d') {
    return this.analytics.getCountries(period);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reset')
  resetAll() {
    return this.analytics.resetAll();
  }

  // ── Helpers ──

  private detectDevice(ua: string): string {
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  private async detectCountry(ip: string): Promise<string | undefined> {
    try {
      // Skip localhost/private IPs
      if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return undefined;
      }
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
        signal: AbortSignal.timeout(2000),
      });
      const data = await res.json() as { status: string; countryCode?: string };
      if (data.status === 'success' && data.countryCode) {
        return data.countryCode;
      }
    } catch {
      // Silently fail — don't block pageview tracking
    }
    return undefined;
  }
}
