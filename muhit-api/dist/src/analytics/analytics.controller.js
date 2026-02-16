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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const track_pageview_dto_1 = require("./dto/track-pageview.dto");
const track_click_dto_1 = require("./dto/track-click.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AnalyticsController = class AnalyticsController {
    analytics;
    constructor(analytics) {
        this.analytics = analytics;
    }
    async trackPageview(dto, req) {
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
        const device = this.detectDevice(userAgent);
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
    async trackClick(dto, req) {
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '';
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
    getSummary(period = '7d') {
        return this.analytics.getSummary(period);
    }
    getPageviews(period = '7d') {
        return this.analytics.getPageviews(period);
    }
    getClicks(period = '7d') {
        return this.analytics.getClicks(period);
    }
    getTopPages(period = '7d') {
        return this.analytics.getTopPages(period);
    }
    getTopButtons(period = '7d') {
        return this.analytics.getTopButtons(period);
    }
    getDevices(period = '7d') {
        return this.analytics.getDevices(period);
    }
    getCountries(period = '7d') {
        return this.analytics.getCountries(period);
    }
    detectDevice(ua) {
        if (/tablet|ipad/i.test(ua))
            return 'tablet';
        if (/mobile|android|iphone/i.test(ua))
            return 'mobile';
        return 'desktop';
    }
    async detectCountry(ip) {
        try {
            if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
                return undefined;
            }
            const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
                signal: AbortSignal.timeout(2000),
            });
            const data = await res.json();
            if (data.status === 'success' && data.countryCode) {
                return data.countryCode;
            }
        }
        catch {
        }
        return undefined;
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('pageview'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_pageview_dto_1.TrackPageviewDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackPageview", null);
__decorate([
    (0, common_1.Post)('click'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_click_dto_1.TrackClickDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackClick", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pageviews'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getPageviews", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('clicks'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getClicks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('top-pages'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTopPages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('top-buttons'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTopButtons", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('devices'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getDevices", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('countries'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getCountries", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map