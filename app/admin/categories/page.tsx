'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tags, Plus, Pencil, Trash2, Check, X, GripVertical, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../lib/auth';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Category {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  sortOrder: number;
}

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // New category form
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ slug: '', nameAr: '', nameEn: '' });
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ slug: '', nameAr: '', nameEn: '' });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      toast.error('فشل تحميل التصنيفات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = async () => {
    if (!newCat.slug || !newCat.nameAr || !newCat.nameEn) {
      toast.error('يرجى تعبئة جميع الحقول');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCat),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed');
      }
      toast.success('تم إضافة التصنيف');
      setNewCat({ slug: '', nameAr: '', nameEn: '' });
      setShowAdd(false);
      fetchCategories();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'فشل الإضافة';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: number) => {
    if (!editData.slug || !editData.nameAr || !editData.nameEn) {
      toast.error('يرجى تعبئة جميع الحقول');
      return;
    }
    try {
      const res = await fetch(`${API}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed');
      }
      toast.success('تم تحديث التصنيف');
      setEditId(null);
      fetchCategories();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'فشل التحديث';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    try {
      const res = await fetch(`${API}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('تم حذف التصنيف');
      fetchCategories();
    } catch {
      toast.error('فشل الحذف');
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditData({ slug: cat.slug, nameAr: cat.nameAr, nameEn: cat.nameEn });
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header title="التصنيفات" />

        <div className="admin-content">
          {/* Action bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
              <Tags size={16} />
              <span>{categories.length} تصنيف</span>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => setShowAdd(!showAdd)}
            >
              <Plus size={16} /> إضافة تصنيف
            </button>
          </div>

          {/* Add form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                className="admin-card"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ marginBottom: 16 }}
              >
                <h4 style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={16} /> تصنيف جديد
                </h4>
                <div className="admin-grid-3" style={{ gap: 12 }}>
                  <div className="admin-field">
                    <label className="admin-label">Slug</label>
                    <input
                      className="admin-input"
                      dir="ltr"
                      placeholder="design"
                      value={newCat.slug}
                      onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">الاسم بالعربي</label>
                    <input
                      className="admin-input"
                      placeholder="تصميم"
                      value={newCat.nameAr}
                      onChange={(e) => setNewCat({ ...newCat, nameAr: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">الاسم بالإنجليزي</label>
                    <input
                      className="admin-input"
                      dir="ltr"
                      placeholder="Design"
                      value={newCat.nameEn}
                      onChange={(e) => setNewCat({ ...newCat, nameEn: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                  <button className="admin-btn" onClick={() => setShowAdd(false)}>إلغاء</button>
                  <button className="admin-btn admin-btn-primary" onClick={handleAdd} disabled={saving}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    حفظ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categories Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--admin-text-muted)' }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
              جاري التحميل...
            </div>
          ) : categories.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: 60, color: 'var(--admin-text-muted)' }}>
              <Tags size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>لا توجد تصنيفات بعد</p>
              <p style={{ fontSize: '0.8rem' }}>أضف تصنيفك الأول بالضغط على زر &ldquo;إضافة تصنيف&rdquo;</p>
            </div>
          ) : (
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg-elevated)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-secondary)', width: 30 }}>#</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Slug</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>عربي</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>English</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-secondary)', width: 100 }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      {editId === cat.id ? (
                        <>
                          <td style={{ padding: '10px 16px', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                            <GripVertical size={14} />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <input className="admin-input" dir="ltr" value={editData.slug} onChange={(e) => setEditData({ ...editData, slug: e.target.value })} style={{ padding: '6px 10px', fontSize: '0.82rem' }} />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <input className="admin-input" value={editData.nameAr} onChange={(e) => setEditData({ ...editData, nameAr: e.target.value })} style={{ padding: '6px 10px', fontSize: '0.82rem' }} />
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <input className="admin-input" dir="ltr" value={editData.nameEn} onChange={(e) => setEditData({ ...editData, nameEn: e.target.value })} style={{ padding: '6px 10px', fontSize: '0.82rem' }} />
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                              <button className="admin-btn" onClick={() => handleEdit(cat.id)} style={{ padding: '4px 8px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'none' }}>
                                <Check size={14} />
                              </button>
                              <button className="admin-btn" onClick={() => setEditId(null)} style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none' }}>
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '12px 16px', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <code style={{ background: 'var(--admin-bg-elevated)', padding: '2px 8px', borderRadius: 6, fontSize: '0.82rem', color: 'var(--admin-accent)' }}>{cat.slug}</code>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.88rem' }}>{cat.nameAr}</td>
                          <td style={{ padding: '12px 16px', fontSize: '0.88rem', direction: 'ltr', textAlign: 'left' }}>{cat.nameEn}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                              <button
                                className="admin-btn"
                                onClick={() => startEdit(cat)}
                                style={{ padding: '6px 8px', background: 'rgba(249,115,22,0.1)', color: '#f97316', border: 'none', borderRadius: 6 }}
                                title="تعديل"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                className="admin-btn"
                                onClick={() => handleDelete(cat.id, cat.nameAr)}
                                style={{ padding: '6px 8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 6 }}
                                title="حذف"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
