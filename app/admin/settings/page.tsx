'use client';

import DashboardLayout from '../components/DashboardLayout';
import VideoThumbnailPicker from '../components/VideoThumbnailPicker';
import { useAuth } from '../lib/auth';
import { apiFetch, apiUpload } from '../lib/api';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Globe, Save, Upload, X, Eye, Info, Image as ImageIcon, Film, Monitor, Smartphone, Camera } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface SeoSettings {
  siteTitle: string;
  siteDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
}

interface ShowreelSettings {
  showreelDesktop: string;
  showreelMobile: string;
  showreelDesktopPoster: string;
  showreelMobilePoster: string;
}

export default function SettingsPage() {
  const { token } = useAuth();

  const [seo, setSeo] = useState<SeoSettings>({
    siteTitle: '',
    siteDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    favicon: '',
  });
  const [showreel, setShowreel] = useState<ShowreelSettings>({
    showreelDesktop: '',
    showreelMobile: '',
    showreelDesktopPoster: '',
    showreelMobilePoster: '',
  });
  const [showDesktopPicker, setShowDesktopPicker] = useState(false);
  const [showMobilePicker, setShowMobilePicker] = useState(false);
  const [savingSeo, setSavingSeo] = useState(false);
  const [loadingSeo, setLoadingSeo] = useState(true);
  const [ogImagePreview, setOgImagePreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const ogImageRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const desktopVideoRef = useRef<HTMLInputElement>(null);
  const mobileVideoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await apiFetch<Record<string, string>>('/settings');
      setSeo({
        siteTitle: data.siteTitle || '',
        siteDescription: data.siteDescription || '',
        ogTitle: data.ogTitle || '',
        ogDescription: data.ogDescription || '',
        ogImage: data.ogImage || '',
        favicon: data.favicon || '',
      });
      setShowreel({
        showreelDesktop: data.showreelDesktop || '',
        showreelMobile: data.showreelMobile || '',
        showreelDesktopPoster: data.showreelDesktopPoster || '',
        showreelMobilePoster: data.showreelMobilePoster || '',
      });
    } catch {
      toast.error('فشل تحميل الإعدادات');
    } finally {
      setLoadingSeo(false);
    }
  };

  const handleUploadImage = async (file: File, field: 'ogImage' | 'favicon') => {
    // Show instant local preview
    const localUrl = URL.createObjectURL(file);
    if (field === 'ogImage') setOgImagePreview(localUrl);
    else setFaviconPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiUpload<{ url: string }>('/media/upload', formData, token!);
      setSeo((prev) => ({ ...prev, [field]: result.url }));
      toast.success('تم رفع الصورة');
    } catch {
      // Clear local preview on failure
      if (field === 'ogImage') setOgImagePreview('');
      else setFaviconPreview('');
      toast.error('فشل رفع الصورة');
    }
  };

  const handleUploadShowreel = async (file: File, type: 'desktop' | 'mobile') => {
    const setUploading = type === 'desktop' ? setUploadingDesktop : setUploadingMobile;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiUpload<{ url: string }>('/media/upload', formData, token!);
      const field = type === 'desktop' ? 'showreelDesktop' : 'showreelMobile';
      setShowreel((prev) => ({ ...prev, [field]: result.url }));
      toast.success(`تم رفع شوريل ${type === 'desktop' ? 'سطح المكتب' : 'الموبايل'}`);
    } catch {
      toast.error('فشل رفع الفيديو');
    } finally {
      setUploading(false);
    }
  };

  // Use local blob preview if available, otherwise fall back to server URL
  const ogImageSrc = ogImagePreview || seo.ogImage;
  const faviconSrc = faviconPreview || seo.favicon;

  const handleSaveSeo = async () => {
    setSavingSeo(true);
    try {
      const allSettings = { ...seo, ...showreel };
      const settings = Object.entries(allSettings).map(([key, value]) => ({ key, value }));
      await apiFetch('/settings', {
        method: 'PUT',
        token: token!,
        body: JSON.stringify({ settings }),
      });
      toast.success('تم حفظ جميع الإعدادات بنجاح');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSavingSeo(false);
    }
  };

  const seoPreviewTitle = seo.ogTitle || seo.siteTitle || 'محيط — وكالة إبداعية';
  const seoPreviewDesc = seo.ogDescription || seo.siteDescription || 'وكالة إبداعية متكاملة';

  const hintStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
    fontSize: '0.78rem',
    color: 'var(--admin-text-muted)',
    lineHeight: 1.5,
    marginTop: 6,
    padding: '8px 10px',
    background: 'var(--admin-bg)',
    borderRadius: 8,
    border: '1px solid var(--admin-border)',
  };

  return (
    <DashboardLayout title="إعدادات الموقع">
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Basic SEO */}
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} /> إعدادات محركات البحث (SEO)
          </h3>

          {loadingSeo ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--admin-text-secondary)' }}>
              جاري التحميل...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Site Title */}
              <div className="admin-field">
                <label className="admin-label">عنوان الموقع</label>
                <input
                  className="admin-input"
                  value={seo.siteTitle}
                  onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                  placeholder="محيط — وكالة إبداعية"
                />
                <div style={hintStyle}>
                  <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>يظهر في تبويب المتصفح وفي نتائج محركات البحث. يُفضل أن يكون بين 50-60 حرف.</span>
                </div>
              </div>

              {/* Site Description */}
              <div className="admin-field">
                <label className="admin-label">وصف الموقع</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={seo.siteDescription}
                  onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
                  placeholder="وكالة إبداعية متكاملة..."
                  style={{ resize: 'vertical' }}
                />
                <div style={hintStyle}>
                  <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>يظهر أسفل العنوان في نتائج Google. يُفضل أن يكون بين 120-160 حرف لأفضل نتيجة.</span>
                </div>
              </div>

              {/* Google Preview */}
              <div style={{ marginTop: 4 }}>
                <label className="admin-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={14} /> معاينة نتائج البحث (Google)
                </label>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: '1px solid var(--admin-border)',
                  background: '#fff',
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#202124', fontFamily: 'Arial, sans-serif', direction: 'rtl', textAlign: 'right' }}>
                    <div style={{ color: '#4d5156', fontSize: '0.75rem', marginBottom: 2 }}>
                      muhitsolution.com
                    </div>
                    <div style={{ color: '#1a0dab', fontSize: '1.1rem', fontWeight: 400, marginBottom: 4, cursor: 'pointer' }}>
                      {seo.siteTitle || 'عنوان الموقع'}
                    </div>
                    <div style={{ color: '#4d5156', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {seo.siteDescription || 'وصف الموقع يظهر هنا...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Open Graph */}
        {!loadingSeo && (
          <motion.div
            className="admin-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye size={18} /> إعدادات السوشيال ميديا (Open Graph)
            </h3>
            <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.5 }}>
              تتحكم هذه الإعدادات بشكل الرابط عند مشاركته على واتساب، تويتر، فيسبوك، وغيرها.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* OG Title */}
              <div className="admin-field">
                <label className="admin-label">عنوان المشاركة</label>
                <input
                  className="admin-input"
                  value={seo.ogTitle}
                  onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                  placeholder="محيط — وكالة إبداعية"
                />
                <div style={hintStyle}>
                  <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>العنوان الذي يظهر عند مشاركة رابط موقعك. إذا تُرك فارغاً يستخدم عنوان الموقع.</span>
                </div>
              </div>

              {/* OG Description */}
              <div className="admin-field">
                <label className="admin-label">وصف المشاركة</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={seo.ogDescription}
                  onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                  placeholder="نصمم هويات بصرية، نطور مواقع..."
                  style={{ resize: 'vertical' }}
                />
                <div style={hintStyle}>
                  <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>وصف قصير يظهر أسفل العنوان في معاينة الرابط. يُفضل 60-100 حرف.</span>
                </div>
              </div>

              {/* OG Image */}
              <div className="admin-field">
                <label className="admin-label">صورة الغلاف للمشاركة</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={ogImageRef}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadImage(file, 'ogImage');
                  }}
                />
                {ogImageSrc ? (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ogImageSrc}
                      alt="OG Preview"
                      style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
                    }}>
                      <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 500 }}>صورة الغلاف</span>
                      <button
                        onClick={() => { setSeo({ ...seo, ogImage: '' }); setOgImagePreview(''); }}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.5)', color: '#fff',
                          border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="admin-btn"
                    onClick={() => ogImageRef.current?.click()}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      border: '2px dashed var(--admin-border)', background: 'transparent',
                      padding: '28px 24px', borderRadius: 12, width: '100%',
                      justifyContent: 'center', color: 'var(--admin-text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={22} />
                    <span style={{ fontWeight: 500 }}>رفع صورة الغلاف</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>PNG, JPG — يُفضل 1200×630 بكسل</span>
                  </button>
                )}
                <div style={hintStyle}>
                  <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div>هذه الصورة تظهر عند مشاركة رابط موقعك على السوشيال ميديا.</div>
                    <div style={{ marginTop: 4 }}>
                      <strong>المقاس المثالي:</strong> 1200 × 630 بكسل (نسبة 1.91:1)<br/>
                      <strong>الحد الأدنى:</strong> 600 × 315 بكسل<br/>
                      <strong>الحجم:</strong> أقل من 5 ميجابايت<br/>
                      <strong>الصيغة:</strong> PNG أو JPG
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--admin-border)', margin: '4px 0' }} />

              {/* Live Social Preview */}
              <div>
                <label className="admin-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={14} /> معاينة مباشرة — شكل الرابط عند المشاركة
                </label>

                {/* Twitter/X Preview */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 6, fontWeight: 500 }}>
                    Twitter / X
                  </div>
                  <div style={{
                    borderRadius: 16, overflow: 'hidden',
                    border: '1px solid var(--admin-border)',
                    background: 'var(--admin-card)',
                    maxWidth: 500,
                  }}>
                    {ogImageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ogImageSrc} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: 200, background: 'var(--admin-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--admin-text-muted)', fontSize: '0.85rem',
                      }}>
                        <ImageIcon size={24} style={{ marginLeft: 8, opacity: 0.4 }} />
                        لا توجد صورة — ارفع صورة غلاف أعلاه
                      </div>
                    )}
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 2 }}>
                        muhitsolution.com
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 3 }}>
                        {seoPreviewTitle}
                      </div>
                      <div style={{
                        fontSize: '0.8rem', color: 'var(--admin-text-secondary)', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                      }}>
                        {seoPreviewDesc}
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Preview */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 6, fontWeight: 500 }}>
                    WhatsApp
                  </div>
                  <div style={{
                    borderRadius: 8, overflow: 'hidden',
                    border: '1px solid #dce0e5',
                    background: '#fff',
                    maxWidth: 400,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}>
                    {ogImageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ogImageSrc} alt="WA Preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: 160, background: '#f0f2f5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#8696a0', fontSize: '0.82rem',
                      }}>
                        لا توجد صورة
                      </div>
                    )}
                    <div style={{ padding: '8px 12px', borderTop: '1px solid #e9ecef' }}>
                      <div style={{ fontSize: '0.72rem', color: '#8696a0', marginBottom: 2, textTransform: 'uppercase' }}>
                        muhitsolution.com
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#111b21', marginBottom: 2 }}>
                        {seoPreviewTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#667781', lineHeight: 1.35 }}>
                        {seoPreviewDesc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Favicon */}
        {!loadingSeo && (
          <motion.div
            className="admin-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ImageIcon size={18} /> أيقونة الموقع (Favicon)
            </h3>

            <input
              type="file"
              accept="image/*,.ico,.svg"
              ref={faviconRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadImage(file, 'favicon');
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Favicon live preview */}
              <div style={{
                width: 64, height: 64, borderRadius: 12,
                border: '2px solid var(--admin-border)',
                overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--admin-bg)',
              }}>
                {faviconSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={faviconSrc} alt="Favicon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <ImageIcon size={20} style={{ color: 'var(--admin-text-muted)', opacity: 0.4 }} />
                )}
              </div>

              {/* Browser tab preview */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 16px 6px 10px', borderRadius: '8px 8px 0 0',
                  background: '#fff', border: '1px solid #ddd', borderBottom: 'none',
                  fontSize: '0.78rem', color: '#333', maxWidth: 240,
                }}>
                  {faviconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={faviconSrc} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: '#ddd' }} />
                  )}
                  <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {seo.siteTitle || 'محيط — وكالة إبداعية'}
                  </span>
                </div>
                <div style={{ height: 2, background: '#ddd', borderRadius: '0 0 4px 4px' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: 6 }}>
                  معاينة تبويب المتصفح
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                className="admin-btn"
                onClick={() => faviconRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  border: '1px solid var(--admin-border)', background: 'transparent',
                  padding: '8px 18px', borderRadius: 8,
                  color: 'var(--admin-text-secondary)', fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} /> {seo.favicon ? 'تغيير الأيقونة' : 'رفع أيقونة'}
              </button>
              {seo.favicon && (
                <button
                  onClick={() => { setSeo({ ...seo, favicon: '' }); setFaviconPreview(''); }}
                  style={{
                    background: 'transparent', border: '1px solid var(--admin-danger)',
                    color: 'var(--admin-danger)', cursor: 'pointer',
                    fontSize: '0.85rem', padding: '8px 18px', borderRadius: 8,
                  }}
                >
                  حذف
                </button>
              )}
            </div>

            <div style={{ ...hintStyle, marginTop: 14 }}>
              <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div>الأيقونة الصغيرة التي تظهر في تبويب المتصفح بجانب عنوان الصفحة.</div>
                <div style={{ marginTop: 4 }}>
                  <strong>المقاس المثالي:</strong> 32 × 32 بكسل أو 64 × 64 بكسل<br/>
                  <strong>الصيغة:</strong> PNG أو ICO أو SVG (يُفضل PNG شفاف)<br/>
                  <strong>نصيحة:</strong> استخدم أيقونة بسيطة وواضحة، تكون مقروءة حتى بأحجام صغيرة جداً
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ SHOWREEL MANAGEMENT ═══════════ */}
        {!loadingSeo && (
          <motion.div
            className="admin-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Film size={18} /> إدارة الشوريل (Showreel)
            </h3>
            <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.5 }}>
              ارفع فيديو الشوريل الذي يظهر في الصفحة الرئيسية. يُفضل رفع نسختين: واحدة لسطح المكتب وأخرى للموبايل.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Hidden file inputs */}
              <input
                type="file"
                accept="video/mp4,video/webm,video/mov"
                ref={desktopVideoRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadShowreel(file, 'desktop');
                }}
              />
              <input
                type="file"
                accept="video/mp4,video/webm,video/mov"
                ref={mobileVideoRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadShowreel(file, 'mobile');
                }}
              />

              {/* Desktop Showreel */}
              <div style={{
                border: '1px solid var(--admin-border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  background: 'var(--admin-bg)',
                  borderBottom: '1px solid var(--admin-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: '0.9rem' }}>
                    <Monitor size={16} /> شوريل سطح المكتب
                  </div>
                  {showreel.showreelDesktop && (
                    <button
                      onClick={() => setShowreel({ ...showreel, showreelDesktop: '' })}
                      style={{
                        background: 'transparent', border: '1px solid var(--admin-danger)',
                        color: 'var(--admin-danger)', cursor: 'pointer',
                        fontSize: '0.75rem', padding: '4px 12px', borderRadius: 6,
                      }}
                    >
                      <X size={12} style={{ marginLeft: 4 }} /> حذف
                    </button>
                  )}
                </div>

                {showreel.showreelDesktop ? (
                  <div style={{ padding: 12 }}>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src={showreel.showreelDesktop}
                      controls
                      style={{ width: '100%', maxHeight: 280, borderRadius: 8, background: '#000' }}
                      preload="metadata"
                    />
                    {/* Poster preview */}
                    {showreel.showreelDesktopPoster && (
                      <div style={{ marginTop: 8, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Camera size={12} /> الصورة المصغّرة الحالية:
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={showreel.showreelDesktopPoster} alt="Desktop poster" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
                        <button
                          onClick={() => setShowreel({ ...showreel, showreelDesktopPoster: '' })}
                          style={{
                            position: 'absolute', top: 24, right: 4,
                            background: 'rgba(220,38,38,0.8)', color: '#fff', border: 'none',
                            borderRadius: '50%', width: 22, height: 22, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setShowDesktopPicker(true)}
                      style={{
                        marginTop: 8, width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '10px 16px', borderRadius: 8,
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: '0.85rem', fontWeight: 600,
                      }}
                    >
                      <Camera size={16} /> {showreel.showreelDesktopPoster ? 'تغيير الصورة المصغّرة' : 'اختيار صورة مصغّرة من الفيديو'}
                    </button>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: 8, wordBreak: 'break-all' }}>
                      {showreel.showreelDesktop}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => desktopVideoRef.current?.click()}
                    disabled={uploadingDesktop}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      border: 'none', background: 'transparent',
                      padding: '36px 24px', width: '100%',
                      justifyContent: 'center', color: 'var(--admin-text-secondary)',
                      cursor: uploadingDesktop ? 'wait' : 'pointer',
                      opacity: uploadingDesktop ? 0.6 : 1,
                    }}
                  >
                    {uploadingDesktop ? (
                      <>
                        <div style={{ width: 24, height: 24, border: '3px solid var(--admin-border)', borderTopColor: 'var(--admin-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontWeight: 500 }}>جاري رفع الفيديو...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={28} />
                        <span style={{ fontWeight: 500 }}>رفع فيديو سطح المكتب</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>MP4 — يُفضل 1920×1080 أو أعلى</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Showreel */}
              <div style={{
                border: '1px solid var(--admin-border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  background: 'var(--admin-bg)',
                  borderBottom: '1px solid var(--admin-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: '0.9rem' }}>
                    <Smartphone size={16} /> شوريل الموبايل
                  </div>
                  {showreel.showreelMobile && (
                    <button
                      onClick={() => setShowreel({ ...showreel, showreelMobile: '' })}
                      style={{
                        background: 'transparent', border: '1px solid var(--admin-danger)',
                        color: 'var(--admin-danger)', cursor: 'pointer',
                        fontSize: '0.75rem', padding: '4px 12px', borderRadius: 6,
                      }}
                    >
                      <X size={12} style={{ marginLeft: 4 }} /> حذف
                    </button>
                  )}
                </div>

                {showreel.showreelMobile ? (
                  <div style={{ padding: 12 }}>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src={showreel.showreelMobile}
                      controls
                      style={{ width: '100%', maxHeight: 280, borderRadius: 8, background: '#000' }}
                      preload="metadata"
                    />
                    {/* Poster preview */}
                    {showreel.showreelMobilePoster && (
                      <div style={{ marginTop: 8, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Camera size={12} /> الصورة المصغّرة الحالية:
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={showreel.showreelMobilePoster} alt="Mobile poster" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
                        <button
                          onClick={() => setShowreel({ ...showreel, showreelMobilePoster: '' })}
                          style={{
                            position: 'absolute', top: 24, right: 4,
                            background: 'rgba(220,38,38,0.8)', color: '#fff', border: 'none',
                            borderRadius: '50%', width: 22, height: 22, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setShowMobilePicker(true)}
                      style={{
                        marginTop: 8, width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '10px 16px', borderRadius: 8,
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: '0.85rem', fontWeight: 600,
                      }}
                    >
                      <Camera size={16} /> {showreel.showreelMobilePoster ? 'تغيير الصورة المصغّرة' : 'اختيار صورة مصغّرة من الفيديو'}
                    </button>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: 8, wordBreak: 'break-all' }}>
                      {showreel.showreelMobile}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => mobileVideoRef.current?.click()}
                    disabled={uploadingMobile}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      border: 'none', background: 'transparent',
                      padding: '36px 24px', width: '100%',
                      justifyContent: 'center', color: 'var(--admin-text-secondary)',
                      cursor: uploadingMobile ? 'wait' : 'pointer',
                      opacity: uploadingMobile ? 0.6 : 1,
                    }}
                  >
                    {uploadingMobile ? (
                      <>
                        <div style={{ width: 24, height: 24, border: '3px solid var(--admin-border)', borderTopColor: 'var(--admin-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontWeight: 500 }}>جاري رفع الفيديو...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={28} />
                        <span style={{ fontWeight: 500 }}>رفع فيديو الموبايل</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>MP4 — يُفضل 1080×1920 (عمودي)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div style={hintStyle}>
                <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div>فيديو الشوريل يظهر في الصفحة الرئيسية للموقع.</div>
                  <div style={{ marginTop: 4 }}>
                    <strong>سطح المكتب:</strong> نسبة عرضية (16:9)، يُفضل 1920×1080<br/>
                    <strong>الموبايل:</strong> نسبة عمودية (9:16)، يُفضل 1080×1920<br/>
                    <strong>الصيغة:</strong> MP4 (يُفضل H.264)<br/>
                    <strong>الحجم:</strong> أقل من 100 ميجابايت
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Save button */}
        {!loadingSeo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSaveSeo}
              disabled={savingSeo}
              style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '0.95rem' }}
            >
              <Save size={18} /> {savingSeo ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
            </button>
          </motion.div>
        )}

        {/* Thumbnail Picker Modals */}
        <AnimatePresence>
          {showDesktopPicker && showreel.showreelDesktop && (
            <VideoThumbnailPicker
              videoSrc={showreel.showreelDesktop}
              projectSlug="showreel"
              onThumbnailCaptured={(url) => setShowreel({ ...showreel, showreelDesktopPoster: url })}
              onClose={() => setShowDesktopPicker(false)}
            />
          )}
          {showMobilePicker && showreel.showreelMobile && (
            <VideoThumbnailPicker
              videoSrc={showreel.showreelMobile}
              projectSlug="showreel"
              onThumbnailCaptured={(url) => setShowreel({ ...showreel, showreelMobilePoster: url })}
              onClose={() => setShowMobilePicker(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

