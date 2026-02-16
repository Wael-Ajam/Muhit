'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { apiFetch } from '../lib/api';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUp,
  ArrowDown,
  BarChart3,
  FileText,
  MapPin,
} from 'lucide-react';

type Period = '7d' | '30d' | '90d';

interface Summary {
  totalViews: number;
  totalClicks: number;
  uniquePages: number;
  topPage: string;
  viewsChange: number;
  clicksChange: number;
  engagementRate: number;
}

interface DailyData {
  date: string;
  count: number;
}

interface TopPage {
  page: string;
  count: number;
}

interface TopButton {
  buttonId: string;
  label: string;
  count: number;
}

interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

interface CountryData {
  country: string;
  count: number;
  percentage: number;
}

const COUNTRY_NAMES: Record<string, string> = {
  SA: 'السعودية', AE: 'الإمارات', KW: 'الكويت', QA: 'قطر', BH: 'البحرين', OM: 'عُمان',
  EG: 'مصر', JO: 'الأردن', LB: 'لبنان', SY: 'سوريا', IQ: 'العراق', PS: 'فلسطين',
  MA: 'المغرب', TN: 'تونس', DZ: 'الجزائر', LY: 'ليبيا', SD: 'السودان', YE: 'اليمن',
  US: 'أمريكا', GB: 'بريطانيا', DE: 'ألمانيا', FR: 'فرنسا', TR: 'تركيا', IN: 'الهند',
  CA: 'كندا', AU: 'أستراليا', NL: 'هولندا', SE: 'السويد', IT: 'إيطاليا', ES: 'إسبانيا',
  BR: 'البرازيل', CN: 'الصين', JP: 'اليابان', KR: 'كوريا', RU: 'روسيا', PK: 'باكستان',
  MY: 'ماليزيا', ID: 'إندونيسيا', NG: 'نيجيريا', ZA: 'جنوب أفريقيا', MX: 'المكسيك', PH: 'الفلبين',
};

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'الرئيسية',
  '/ar': 'الرئيسية (عربي)',
  '/en': 'الرئيسية (إنجليزي)',
  '/ar/about': 'من نحن',
  '/en/about': 'About Us',
  '/ar/contact': 'تواصل معنا',
  '/en/contact': 'Contact',
  '/ar/portfolio': 'أعمالنا',
  '/en/portfolio': 'Portfolio',
  '/ar/pricing': 'الباقات',
  '/en/pricing': 'Pricing',
};

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 أيام',
  '30d': '30 يوم',
  '90d': '90 يوم',
};

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const DEVICE_LABELS: Record<string, string> = {
  desktop: 'كمبيوتر',
  mobile: 'جوال',
  tablet: 'تابلت',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [period, setPeriod] = useState<Period>('7d');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pageviews, setPageviews] = useState<DailyData[]>([]);
  const [clicks, setClicks] = useState<DailyData[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [topButtons, setTopButtons] = useState<TopButton[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [countries, setCountries] = useState<CountryData[]>([]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, pv, cl, tp, tb, dv, ct] = await Promise.all([
        apiFetch<Summary>(`/analytics/summary?period=${period}`, { token }),
        apiFetch<DailyData[]>(`/analytics/pageviews?period=${period}`, { token }),
        apiFetch<DailyData[]>(`/analytics/clicks?period=${period}`, { token }),
        apiFetch<TopPage[]>(`/analytics/top-pages?period=${period}`, { token }),
        apiFetch<TopButton[]>(`/analytics/top-buttons?period=${period}`, { token }),
        apiFetch<DeviceData[]>(`/analytics/devices?period=${period}`, { token }),
        apiFetch<CountryData[]>(`/analytics/countries?period=${period}`, { token }),
      ]);
      setSummary(s);
      setPageviews(pv);
      setClicks(cl);
      setTopPages(tp);
      setTopButtons(tb);
      setDevices(dv);
      setCountries(ct);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }, [token, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxViewCount = Math.max(...pageviews.map((d) => d.count), 1);
  const maxClickCount = Math.max(...clicks.map((d) => d.count), 1);
  const labelStep = period === '90d' ? 7 : period === '30d' ? 3 : 1;

  return (
    <DashboardLayout title="التحليلات">
      {/* Period Selector */}
      <div className="analytics-period-bar">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            className={`analytics-period-btn ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--admin-text-muted)', padding: 60, textAlign: 'center' }}>
          جاري تحميل التحليلات...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div
            className="admin-stats-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {[
              {
                label: 'إجمالي الزيارات',
                value: summary?.totalViews || 0,
                change: summary?.viewsChange || 0,
                icon: Eye,
                color: '#3b82f6',
              },
              {
                label: 'النقرات (CTA)',
                value: summary?.totalClicks || 0,
                change: summary?.clicksChange || 0,
                icon: MousePointerClick,
                color: '#f97316',
              },
              {
                label: 'معدل التفاعل',
                value: `${summary?.engagementRate || 0}%`,
                icon: TrendingUp,
                color: '#22c55e',
              },
              {
                label: 'صفحات فريدة',
                value: summary?.uniquePages || 0,
                icon: Globe,
                color: '#a855f7',
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="analytics-stat-card"
                >
                  <div className="analytics-stat-header">
                    <div
                      className="analytics-stat-icon"
                      style={{
                        color: stat.color,
                        background: `${stat.color}15`,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    {'change' in stat && stat.change !== undefined && (
                      <span
                        className={`analytics-stat-change ${
                          (stat.change as number) >= 0 ? 'positive' : 'negative'
                        }`}
                      >
                        {(stat.change as number) >= 0 ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                        {Math.abs(stat.change as number)}%
                      </span>
                    )}
                  </div>
                  <div className="analytics-stat-value">{stat.value}</div>
                  <div className="analytics-stat-label">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts Row */}
          <div className="analytics-grid-2">
            {/* Page Views Chart */}
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
              className="admin-card analytics-chart-card"
            >
              <div className="analytics-card-header">
                <div className="analytics-card-title">
                  <BarChart3 size={18} style={{ color: '#3b82f6' }} />
                  <h3>الزيارات اليومية</h3>
                </div>
              </div>
              <div className="analytics-bar-chart">
                {pageviews.map((d, i) => (
                  <div key={i} className="analytics-bar-col">
                    <div className="analytics-bar-tooltip">{d.count}</div>
                    <div
                      className="analytics-bar"
                      style={{
                        height: `${(d.count / maxViewCount) * 100}%`,
                        background:
                          'linear-gradient(to top, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 1))',
                      }}
                    />
                    <span className="analytics-bar-label">
                      {i % labelStep === 0 ? new Date(d.date).getDate() : ''}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Clicks Chart */}
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.3 }}
              className="admin-card analytics-chart-card"
            >
              <div className="analytics-card-header">
                <div className="analytics-card-title">
                  <MousePointerClick size={18} style={{ color: '#f97316' }} />
                  <h3>النقرات اليومية</h3>
                </div>
              </div>
              <div className="analytics-bar-chart">
                {clicks.map((d, i) => (
                  <div key={i} className="analytics-bar-col">
                    <div className="analytics-bar-tooltip">{d.count}</div>
                    <div
                      className="analytics-bar"
                      style={{
                        height: `${(d.count / maxClickCount) * 100}%`,
                        background:
                          'linear-gradient(to top, rgba(249, 115, 22, 0.6), rgba(249, 115, 22, 1))',
                      }}
                    />
                    <span className="analytics-bar-label">
                      {i % labelStep === 0 ? new Date(d.date).getDate() : ''}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tables Row */}
          <div className="analytics-grid-2" style={{ marginTop: 24 }}>
            {/* Top Pages */}
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.4 }}
              className="admin-card"
            >
              <div className="analytics-card-header">
                <div className="analytics-card-title">
                  <FileText size={18} style={{ color: '#a855f7' }} />
                  <h3>أكثر الصفحات زيارة</h3>
                </div>
              </div>
              <div className="analytics-rank-list">
                {topPages.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    لا توجد بيانات بعد
                  </div>
                ) : (
                  topPages.map((p, i) => (
                    <div key={p.page} className="analytics-rank-item">
                      <div className="analytics-rank-num">{i + 1}</div>
                      <div className="analytics-rank-info">
                        <div className="analytics-rank-name">
                          {PAGE_LABELS[p.page] || p.page}
                        </div>
                        <div className="analytics-rank-bar-wrap">
                          <div
                            className="analytics-rank-bar"
                            style={{
                              width: `${(p.count / (topPages[0]?.count || 1)) * 100}%`,
                              background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                            }}
                          />
                        </div>
                      </div>
                      <div className="analytics-rank-count">{p.count}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Top Buttons */}
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.5 }}
              className="admin-card"
            >
              <div className="analytics-card-header">
                <div className="analytics-card-title">
                  <MousePointerClick size={18} style={{ color: '#f97316' }} />
                  <h3>أكثر الأزرار نقراً</h3>
                </div>
              </div>
              <div className="analytics-rank-list">
                {topButtons.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    لا توجد بيانات بعد
                  </div>
                ) : (
                  topButtons.map((b, i) => (
                    <div key={b.buttonId} className="analytics-rank-item">
                      <div className="analytics-rank-num">{i + 1}</div>
                      <div className="analytics-rank-info">
                        <div className="analytics-rank-name">{b.label}</div>
                        <div className="analytics-rank-bar-wrap">
                          <div
                            className="analytics-rank-bar"
                            style={{
                              width: `${(b.count / (topButtons[0]?.count || 1)) * 100}%`,
                              background: 'linear-gradient(90deg, #f97316, #ea580c)',
                            }}
                          />
                        </div>
                      </div>
                      <div className="analytics-rank-count">{b.count}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Device Breakdown */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.6 }}
            className="admin-card"
            style={{ marginTop: 24 }}
          >
            <div className="analytics-card-header">
              <div className="analytics-card-title">
                <Monitor size={18} style={{ color: '#22c55e' }} />
                <h3>توزيع الأجهزة</h3>
              </div>
            </div>
            <div className="analytics-devices-grid">
              {devices.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--admin-text-muted)', gridColumn: '1 / -1' }}>
                  لا توجد بيانات بعد
                </div>
              ) : (
                devices.map((d) => {
                  const DeviceIcon = DEVICE_ICONS[d.device] || Monitor;
                  const colors: Record<string, string> = {
                    desktop: '#3b82f6',
                    mobile: '#f97316',
                    tablet: '#22c55e',
                  };
                  const color = colors[d.device] || '#8b8ba0';
                  return (
                    <div key={d.device} className="analytics-device-card">
                      <div
                        className="analytics-device-icon"
                        style={{ color, background: `${color}15` }}
                      >
                        <DeviceIcon size={28} />
                      </div>
                      <div className="analytics-device-name">
                        {DEVICE_LABELS[d.device] || d.device}
                      </div>
                      <div className="analytics-device-pct" style={{ color }}>
                        {d.percentage}%
                      </div>
                      <div className="analytics-device-count">
                        {d.count} زيارة
                      </div>
                      <div className="analytics-device-bar-wrap">
                        <div
                          className="analytics-device-bar"
                          style={{
                            width: `${d.percentage}%`,
                            background: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Country Breakdown */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.7 }}
            className="admin-card"
            style={{ marginTop: 24 }}
          >
            <div className="analytics-card-header">
              <div className="analytics-card-title">
                <MapPin size={18} style={{ color: '#e11d48' }} />
                <h3>الزيارات حسب الدولة</h3>
              </div>
            </div>
            <div className="analytics-rank-list">
              {countries.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  لا توجد بيانات بعد — ستظهر بعد أول زيارة من IP خارجي
                </div>
              ) : (
                countries.map((c, i) => (
                  <div key={c.country} className="analytics-rank-item">
                    <div className="analytics-rank-num">{i + 1}</div>
                    <div style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>
                      {countryFlag(c.country)}
                    </div>
                    <div className="analytics-rank-info">
                      <div className="analytics-rank-name">
                        {COUNTRY_NAMES[c.country] || c.country}
                      </div>
                      <div className="analytics-rank-bar-wrap">
                        <div
                          className="analytics-rank-bar"
                          style={{
                            width: `${(c.count / (countries[0]?.count || 1)) * 100}%`,
                            background: 'linear-gradient(90deg, #e11d48, #be123c)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="analytics-rank-count" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      <span>{c.count}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>{c.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </DashboardLayout>
  );
}
