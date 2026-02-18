'use client';

import DashboardLayout from '../../components/DashboardLayout';
import MediaUploader from '../../components/MediaUploader';
import VideoThumbnailPicker from '../../components/VideoThumbnailPicker';
import { useAuth } from '../../lib/auth';
import { useNotifications } from '../../lib/notifications';
import { apiFetch, apiUpload } from '../../lib/api';
import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, ArrowRight, Image, Trash2, GripVertical, Upload, Plus, Eye, ImagePlus, Video, X } from 'lucide-react';

interface GalleryItem {
  id: number;
  type: string;
  src: string;
  layout: string;
  sortOrder: number;
  width: number;
  height: number;
  aspectRatio: number;
}

interface ProjectData {
  id?: number;
  slug: string;
  category: string;
  coverImage: string;
  coverVideo: string;
  isVideo: boolean;
  websiteUrl: string;
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  longDescAr: string;
  longDescEn: string;
  storyP2Ar: string;
  storyP2En: string;
  storyP3Ar: string;
  storyP3En: string;
  tags: { id?: number; tagKey: string }[];
  gallery: GalleryItem[];
}

const emptyProject: ProjectData = {
  slug: '',
  category: 'design',
  coverImage: '',
  coverVideo: '',
  isVideo: false,
  websiteUrl: '',
  sortOrder: 0,
  isPublished: true,
  isFeatured: false,
  titleAr: '',
  titleEn: '',
  descAr: '',
  descEn: '',
  longDescAr: '',
  longDescEn: '',
  storyP2Ar: '',
  storyP2En: '',
  storyP3Ar: '',
  storyP3En: '',
  tags: [],
  gallery: [],
};

// ── Helper: compute layout from aspect ratio ──
function computeLayout(width: number, height: number): string {
  if (width === 0 || height === 0) return 'landscape';
  const ratio = width / height;
  if (ratio >= 1.5) return 'landscape';
  if (ratio <= 0.75) return 'portrait';
  return 'square';
}

export default function ProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const isNew = id === 'new';

  const [project, setProject] = useState<ProjectData>(emptyProject);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [dragItemId, setDragItemId] = useState<number | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<number | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [showThumbnailPicker, setShowThumbnailPicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const coverVideoInputRef = useRef<HTMLInputElement>(null);

  const [categoryOptions, setCategoryOptions] = useState<{ slug: string; nameAr: string }[]>([]);

  // Load categories
  useEffect(() => {
    apiFetch<{ slug: string; nameAr: string }[]>('/categories')
      .then(setCategoryOptions)
      .catch(() => {});
  }, []);

  // Load project data
  useEffect(() => {
    if (isNew || !token) return;
    apiFetch<ProjectData & { categories?: { categorySlug: string }[] }>(`/projects/${id}`, { token })
      .then((data) => {
        setProject(data);
        setTagsInput(data.tags?.map((t) => t.tagKey).join(', ') || '');
        setSelectedCategories(data.categories?.map((c) => c.categorySlug) || (data.category ? [data.category] : []));
      })
      .catch(() => toast.error('فشل تحميل المشروع'))
      .finally(() => setLoading(false));
  }, [id, isNew, token]);

  const handleChange = (field: keyof ProjectData, value: string | boolean | number) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  // ── Cover Image Upload ──
  const handleCoverImageUpload = useCallback(async (file: File) => {
    if (!token) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectSlug', project.slug || 'temp');
      const result = await apiUpload<{ url: string; originalName: string }>('/media/upload', formData, token);
      setProject((prev) => ({ ...prev, coverImage: result.url }));
      toast.success('تم رفع صورة الغلاف');
    } catch {
      toast.error('فشل رفع صورة الغلاف');
    } finally {
      setUploadingCover(false);
    }
  }, [token, project.slug]);

  // ── Cover Video Upload ──
  const handleCoverVideoUpload = useCallback(async (file: File) => {
    if (!token) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectSlug', project.slug || 'temp');
      const result = await apiUpload<{ url: string; originalName: string }>('/media/upload', formData, token);
      setProject((prev) => ({ ...prev, coverVideo: result.url, isVideo: true }));
      toast.success('تم رفع فيديو الغلاف');
    } catch {
      toast.error('فشل رفع فيديو الغلاف');
    } finally {
      setUploadingVideo(false);
    }
  }, [token, project.slug]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      slug: project.slug,
      category: selectedCategories[0] || project.category,
      coverImage: project.coverImage,
      coverVideo: project.coverVideo || null,
      isVideo: project.isVideo,
      websiteUrl: project.websiteUrl || null,
      sortOrder: project.sortOrder,
      isPublished: project.isPublished,
      isFeatured: project.isFeatured,
      titleAr: project.titleAr,
      titleEn: project.titleEn,
      descAr: project.descAr,
      descEn: project.descEn,
      longDescAr: project.longDescAr,
      longDescEn: project.longDescEn,
      storyP2Ar: project.storyP2Ar,
      storyP2En: project.storyP2En,
      storyP3Ar: project.storyP3Ar,
      storyP3En: project.storyP3En,
      tags,
      categories: selectedCategories,
    };

    try {
      if (isNew) {
        const created = await apiFetch<{ id: number }>('/projects', {
          method: 'POST',
          token,
          body: JSON.stringify(body),
        });
        toast.success('تم إنشاء المشروع بنجاح');
        addNotification('success', 'مشروع جديد', `تم إنشاء "${project.titleAr}"`);
        router.push(`/admin/projects/${created.id}`);
      } else {
        await apiFetch(`/projects/${id}`, {
          method: 'PUT',
          token,
          body: JSON.stringify(body),
        });
        toast.success('تم حفظ التغييرات ✅');
        addNotification('success', 'تحديث مشروع', `تم تحديث "${project.titleAr}"`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ');
      addNotification('error', 'خطأ في الحفظ', err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGalleryItem = async (itemId: number) => {
    if (!token) return;
    try {
      await apiFetch(`/projects/${id}/gallery/${itemId}`, { method: 'DELETE', token });
      setProject((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => g.id !== itemId),
      }));
      toast.success('تم حذف العنصر');
      addNotification('info', 'حذف من المعرض', 'تم حذف عنصر من المعرض');
    } catch {
      toast.error('فشل حذف العنصر');
    }
  };

  // ── Smart Gallery Upload — auto-detect dimensions ──
  const handleUploadComplete = useCallback(
    (url: string) => {
      if (!token || isNew) return;

      const isVideoFile = /\.(mp4|mov|webm|avi)$/i.test(url);

      const detectAndAdd = (width: number, height: number) => {
        const ar = width > 0 && height > 0 ? width / height : 1.0;
        const layout = computeLayout(width, height);

        apiFetch<GalleryItem>(`/projects/${id}/gallery`, {
          method: 'POST',
          token,
          body: JSON.stringify({
            type: isVideoFile ? 'video' : 'image',
            src: url,
            layout,
            width,
            height,
            aspectRatio: Math.round(ar * 100) / 100,
          }),
        }).then((item) => {
          setProject((prev) => ({
            ...prev,
            gallery: [...prev.gallery, item],
          }));
          toast.success(`تمت إضافة ${isVideoFile ? 'فيديو' : 'صورة'} (${layout})`);
        }).catch(() => {
          toast.error('تم رفع الملف لكن فشلت إضافته للمعرض');
        });
      };

      if (isVideoFile) {
        // For videos, use <video> element to detect dimensions
        const video = document.createElement('video');
        video.src = url;
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          detectAndAdd(video.videoWidth, video.videoHeight);
          video.remove();
        };
        video.onerror = () => {
          detectAndAdd(1920, 1080); // default landscape
          video.remove();
        };
      } else {
        // For images, use <img> element
        const img = document.createElement('img');
        img.src = url;
        img.onload = () => {
          detectAndAdd(img.naturalWidth, img.naturalHeight);
        };
        img.onerror = () => {
          detectAndAdd(1920, 1080); // default landscape
        };
      }
    },
    [token, id, isNew],
  );

  // ── Drag & Drop Gallery ──
  const handleDragStart = (itemId: number) => {
    setDragItemId(itemId);
  };

  const handleDragOver = (e: React.DragEvent, itemId: number) => {
    e.preventDefault();
    if (dragItemId !== itemId) {
      setDragOverItemId(itemId);
    }
  };

  const handleDragEnd = async () => {
    if (dragItemId === null || dragOverItemId === null || dragItemId === dragOverItemId) {
      setDragItemId(null);
      setDragOverItemId(null);
      return;
    }

    const gallery = [...project.gallery];
    const fromIndex = gallery.findIndex((g) => g.id === dragItemId);
    const toIndex = gallery.findIndex((g) => g.id === dragOverItemId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = gallery.splice(fromIndex, 1);
    gallery.splice(toIndex, 0, moved);

    const reordered = gallery.map((g, i) => ({ ...g, sortOrder: i }));
    setProject((prev) => ({ ...prev, gallery: reordered }));
    setDragItemId(null);
    setDragOverItemId(null);

    if (token) {
      try {
        await apiFetch(`/projects/${id}/gallery/reorder`, {
          method: 'PUT',
          token,
          body: JSON.stringify({
            order: reordered.map((g) => g.id),
          }),
        });
        toast.success('تم إعادة ترتيب المعرض');
        addNotification('info', 'ترتيب المعرض', 'تم إعادة ترتيب عناصر المعرض');
      } catch {
        toast.error('فشل حفظ الترتيب');
      }
    }
  };

  // ── Layout label helper ──
  const layoutLabel = (layout: string) => {
    switch (layout) {
      case 'landscape': return '🖼️ عرضي';
      case 'portrait': return '📱 طولي';
      case 'square': return '⬛ مربع';
      default: return layout;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title={isNew ? 'مشروع جديد' : 'تعديل المشروع'}>
        <div style={{ color: 'var(--admin-text-muted)', padding: 40, textAlign: 'center' }}>
          جاري التحميل...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={isNew ? 'مشروع جديد' : `تعديل: ${project.titleAr}`}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* ═══ Header — Back + Preview + Save ═══ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => router.push('/admin/projects')}
          >
            <ArrowRight size={16} /> العودة
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {!isNew && project.slug && (
              <a
                href={`/ar/portfolio/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              >
                <Eye size={16} /> معاينة المشروع
              </a>
            )}
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>

        {/* ═══ Cover Media — Image + Video Side by Side ═══ */}
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ImagePlus size={18} /> أغلفة المشروع
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Cover Image Upload */}
            <div>
              <label className="admin-label" style={{ marginBottom: 8, display: 'block' }}>صورة الغلاف</label>
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleCoverImageUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              {project.coverImage ? (
                <div style={{ position: 'relative', borderRadius: 'var(--admin-radius)', overflow: 'hidden', aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                    <button
                      className="admin-btn admin-btn-sm"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px' }}
                      onClick={() => coverImageInputRef.current?.click()}
                    >
                      تغيير
                    </button>
                    <button
                      className="admin-btn admin-btn-sm"
                      style={{ background: 'rgba(220,38,38,0.8)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px' }}
                      onClick={() => setProject((p) => ({ ...p, coverImage: '' }))}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  whileHover={{ borderColor: 'var(--admin-accent)' }}
                  onClick={() => coverImageInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleCoverImageUpload(e.dataTransfer.files[0]);
                  }}
                  style={{
                    border: '2px dashed var(--admin-border)',
                    borderRadius: 'var(--admin-radius)',
                    aspectRatio: '16/9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--admin-text-muted)',
                    gap: 8,
                  }}
                >
                  {uploadingCover ? (
                    <span style={{ fontSize: '0.85rem' }}>جاري الرفع...</span>
                  ) : (
                    <>
                      <ImagePlus size={28} style={{ opacity: 0.5 }} />
                      <span style={{ fontSize: '0.82rem' }}>اسحب صورة هنا أو اضغط للاختيار</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Cover Video Upload */}
            <div>
              <label className="admin-label" style={{ marginBottom: 8, display: 'block' }}>فيديو الغلاف</label>
              <input
                ref={coverVideoInputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleCoverVideoUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
              {project.coverVideo ? (
                <div style={{ position: 'relative', borderRadius: 'var(--admin-radius)', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <video src={project.coverVideo} muted loop playsInline autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                    <button
                      className="admin-btn admin-btn-sm"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px' }}
                      onClick={() => coverVideoInputRef.current?.click()}
                    >
                      تغيير
                    </button>
                    <button
                      className="admin-btn admin-btn-sm"
                      style={{ background: 'rgba(220,38,38,0.8)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px' }}
                      onClick={() => setProject((p) => ({ ...p, coverVideo: '', isVideo: false }))}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {/* Thumbnail Capture Button */}
                  <button
                    className="admin-btn admin-btn-sm"
                    onClick={() => setShowThumbnailPicker(true)}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      background: 'linear-gradient(135deg, rgba(249,115,22,0.9), rgba(234,88,12,0.9))',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                    }}
                  >
                    📸 صورة مصغّرة
                  </button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ borderColor: 'var(--admin-accent)' }}
                  onClick={() => coverVideoInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleCoverVideoUpload(e.dataTransfer.files[0]);
                  }}
                  style={{
                    border: '2px dashed var(--admin-border)',
                    borderRadius: 'var(--admin-radius)',
                    aspectRatio: '16/9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--admin-text-muted)',
                    gap: 8,
                  }}
                >
                  {uploadingVideo ? (
                    <span style={{ fontSize: '0.85rem' }}>جاري الرفع...</span>
                  ) : (
                    <>
                      <Video size={28} style={{ opacity: 0.5 }} />
                      <span style={{ fontSize: '0.82rem' }}>اسحب فيديو هنا أو اضغط للاختيار</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Bilingual Content ═══ */}
        <div className="admin-grid-2">
          {/* Right column — Arabic */}
          <div className="admin-card">
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>المحتوى العربي</h3>
            <div className="admin-field">
              <label className="admin-label">العنوان بالعربي</label>
              <input className="admin-input" value={project.titleAr} onChange={(e) => handleChange('titleAr', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">الوصف بالعربي</label>
              <textarea className="admin-input admin-textarea" value={project.descAr} onChange={(e) => handleChange('descAr', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">الوصف المطوّل بالعربي</label>
              <textarea className="admin-input admin-textarea" value={project.longDescAr} onChange={(e) => handleChange('longDescAr', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">القصة - الفقرة 2</label>
              <textarea className="admin-input admin-textarea" value={project.storyP2Ar} onChange={(e) => handleChange('storyP2Ar', e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">القصة - الفقرة 3</label>
              <textarea className="admin-input admin-textarea" value={project.storyP3Ar} onChange={(e) => handleChange('storyP3Ar', e.target.value)} />
            </div>
          </div>

          {/* Left column — English */}
          <div className="admin-card">
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>English Content</h3>
            <div className="admin-field">
              <label className="admin-label">Title (English)</label>
              <input className="admin-input" value={project.titleEn} onChange={(e) => handleChange('titleEn', e.target.value)} dir="ltr" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Description (English)</label>
              <textarea className="admin-input admin-textarea" value={project.descEn} onChange={(e) => handleChange('descEn', e.target.value)} dir="ltr" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Long Description (English)</label>
              <textarea className="admin-input admin-textarea" value={project.longDescEn} onChange={(e) => handleChange('longDescEn', e.target.value)} dir="ltr" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Story Paragraph 2</label>
              <textarea className="admin-input admin-textarea" value={project.storyP2En} onChange={(e) => handleChange('storyP2En', e.target.value)} dir="ltr" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Story Paragraph 3</label>
              <textarea className="admin-input admin-textarea" value={project.storyP3En} onChange={(e) => handleChange('storyP3En', e.target.value)} dir="ltr" />
            </div>
          </div>
        </div>

        {/* ═══ Project Metadata ═══ */}
        <div className="admin-card" style={{ marginTop: 16 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>بيانات المشروع</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Slug</label>
              <input className="admin-input" value={project.slug} onChange={(e) => handleChange('slug', e.target.value)} dir="ltr" placeholder="my-project-slug" />
            </div>
            <div className="admin-field">
              <label className="admin-label">التصنيفات</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categoryOptions.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.slug);
                  return (
                    <label
                      key={cat.slug}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: `1.5px solid ${isSelected ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
                        background: isSelected ? 'var(--admin-accent-light)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedCategories(prev =>
                            isSelected
                              ? prev.filter(s => s !== cat.slug)
                              : [...prev, cat.slug]
                          );
                        }}
                        style={{ accentColor: 'var(--admin-accent)', width: 14, height: 14 }}
                      />
                      {cat.nameAr}
                    </label>
                  );
                })}
              </div>
              {selectedCategories.length === 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--admin-danger)', marginTop: 4 }}>
                  يرجى اختيار تصنيف واحد على الأقل
                </div>
              )}
            </div>
            <div className="admin-field">
              <label className="admin-label">رابط الموقع</label>
              <input className="admin-input" value={project.websiteUrl} onChange={(e) => handleChange('websiteUrl', e.target.value)} dir="ltr" placeholder="https://example.com" />
            </div>
            <div className="admin-field">
              <label className="admin-label">الوسوم (مفصولة بفواصل)</label>
              <input className="admin-input" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} dir="ltr" placeholder="tagDesign, tagMotion" />
            </div>
            <div className="admin-field">
              <label className="admin-label">ترتيب العرض</label>
              <input className="admin-input" type="number" value={project.sortOrder} onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)} />
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '12px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={project.isPublished} onChange={(e) => handleChange('isPublished', e.target.checked)} style={{ accentColor: 'var(--admin-accent)' }} />
                <span style={{ fontSize: '0.9rem' }}>منشور</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={project.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} style={{ accentColor: 'var(--admin-accent)' }} />
                <span style={{ fontSize: '0.9rem' }}>مميّز</span>
              </label>
            </div>
          </div>
        </div>

        {/* ═══ Smart Gallery ═══ */}
        {!isNew && (
          <div className="admin-card" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Image size={18} /> المعرض الذكي ({project.gallery?.length || 0})
              </h3>
              <button
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => setShowUploader(!showUploader)}
              >
                {showUploader ? <span>إخفاء</span> : <><Upload size={14} /> رفع ملفات</>}
              </button>
            </div>

            {/* Upload info */}
            <div style={{
              background: 'var(--admin-accent-light)',
              borderRadius: 'var(--admin-radius-sm)',
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: '0.82rem',
              color: 'var(--admin-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              💡 يتم كشف أبعاد الصور/الفيديو تلقائياً وتحديد التخطيط (عرضي / طولي / مربع)
            </div>

            {/* Media Uploader */}
            <AnimatePresence>
              {showUploader && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: 20, overflow: 'hidden' }}
                >
                  <MediaUploader
                    projectSlug={project.slug}
                    onUploadComplete={handleUploadComplete}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gallery Grid with Drag & Drop */}
            {project.gallery?.length > 0 ? (
              <>
                <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginBottom: 12 }}>
                  💡 اسحب العناصر لإعادة ترتيبها — التخطيط يُحدد تلقائياً حسب الأبعاد
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {project.gallery.map((item) => (
                    <motion.div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      onDragEnd={handleDragEnd}
                      layout
                      animate={{
                        scale: dragOverItemId === item.id ? 1.05 : 1,
                        borderColor: dragOverItemId === item.id ? 'var(--admin-accent)' : 'transparent',
                      }}
                      style={{
                        position: 'relative',
                        background: 'var(--admin-bg-elevated)',
                        borderRadius: 'var(--admin-radius-sm)',
                        overflow: 'hidden',
                        aspectRatio: item.layout === 'portrait' ? '3/4' : item.layout === 'landscape' ? '16/10' : '1',
                        cursor: 'grab',
                        border: '2px solid transparent',
                        opacity: dragItemId === item.id ? 0.5 : 1,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Drag handle */}
                      <div style={{
                        position: 'absolute', top: 6, right: 6, zIndex: 2,
                        background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: 2,
                        color: 'white',
                      }}>
                        <GripVertical size={14} />
                      </div>

                      {item.type === 'image' ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.src}
                          alt="gallery item"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                        />
                      ) : (
                        <video
                          src={item.src}
                          muted
                          loop
                          playsInline
                          autoPlay
                          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                        />
                      )}

                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={(e) => { e.stopPropagation(); handleDeleteGalleryItem(item.id); }}
                        style={{
                          position: 'absolute', top: 6, left: 6, zIndex: 2,
                          padding: 4, borderRadius: 6,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Layout badge + dimensions */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(0,0,0,0.7)', padding: '5px 8px',
                        fontSize: '0.72rem', color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span>{layoutLabel(item.layout)}</span>
                        <span style={{ opacity: 0.7 }}>
                          {item.width > 0 ? `${item.width}×${item.height}` : `#${item.sortOrder}`}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--admin-text-muted)' }}>
                <Image size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p style={{ fontSize: '0.9rem' }}>لا توجد عناصر في المعرض</p>
                {!showUploader && (
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setShowUploader(true)}
                    style={{ marginTop: 12 }}
                  >
                    <Plus size={14} /> رفع أول ملف
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Video Thumbnail Picker Modal */}
      <AnimatePresence>
        {showThumbnailPicker && project.coverVideo && (
          <VideoThumbnailPicker
            videoSrc={project.coverVideo}
            projectSlug={project.slug || 'temp'}
            onThumbnailCaptured={(url) => {
              setProject((prev) => ({ ...prev, coverImage: url }));
            }}
            onClose={() => setShowThumbnailPicker(false)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
