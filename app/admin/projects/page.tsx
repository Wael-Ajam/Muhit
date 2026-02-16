'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image,
  GripVertical,
} from 'lucide-react';

interface Project {
  id: number;
  slug: string;
  category: string;
  coverImage: string;
  isPublished: boolean;
  isFeatured: boolean;
  titleAr: string;
  titleEn: string;
  descAr: string;
  tags: { id: number; tagKey: string }[];
  gallery: { id: number }[];
  sortOrder: number;
}

export default function ProjectsPage() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchProjects = () => {
    if (!token) return;
    setLoading(true);
    apiFetch<Project[]>('/projects', { token })
      .then(setProjects)
      .catch(() => toast.error('فشل تحميل المشاريع'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    const projectName = projects.find((p) => p.id === deleteId)?.titleAr || '';
    try {
      await apiFetch(`/projects/${deleteId}`, { method: 'DELETE', token });
      toast.success('تم حذف المشروع بنجاح');
      addNotification('warning', 'حذف مشروع', `تم حذف "${projectName}"`);
      setDeleteId(null);
      fetchProjects();
    } catch {
      toast.error('فشل حذف المشروع');
      addNotification('error', 'فشل الحذف', `فشل حذف "${projectName}"`);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.titleAr.includes(search) ||
      p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search);
    const matchesCat = !catFilter || p.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const categories = [...new Set(projects.map((p) => p.category))];

  return (
    <DashboardLayout title="المشاريع">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-group">
          <div className="admin-search-bar">
            <Search />
            <input
              className="admin-input"
              placeholder="بحث عن مشروع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-input admin-select"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ maxWidth: 160 }}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          className="admin-btn admin-btn-primary"
          onClick={() => router.push('/admin/projects/new')}
        >
          <Plus size={18} />
          مشروع جديد
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: 'var(--admin-text-muted)', padding: 40, textAlign: 'center' }}>
          جاري تحميل المشاريع...
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <FolderIcon />
          <p>لا توجد مشاريع مطابقة</p>
        </div>
      ) : (
        <motion.div
          className="admin-table-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}><GripVertical size={14} /></th>
                <th>المشروع</th>
                <th>التصنيف</th>
                <th>الحالة</th>
                <th>المعرض</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td style={{ color: 'var(--admin-text-muted)' }}>{project.sortOrder}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={project.coverImage} alt="" className="admin-project-thumb" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{project.titleAr}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {project.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-accent">{project.category}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${project.isPublished ? 'admin-badge-success' : 'admin-badge-muted'}`}>
                      {project.isPublished ? (
                        <><Eye size={12} /> منشور</>
                      ) : (
                        <><EyeOff size={12} /> مسودة</>
                      )}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--admin-text-secondary)' }}>
                      <Image size={14} /> {project.gallery?.length || 0}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        title="تعديل"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => setDeleteId(project.id)}
                        title="حذف"
                        style={{ color: 'var(--admin-error)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="admin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              className="admin-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>
                تأكيد الحذف
              </h2>
              <p style={{ color: 'var(--admin-text-secondary)', marginBottom: 24 }}>
                هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start' }}>
                <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
                  <Trash2 size={16} /> حذف
                </button>
                <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function FolderIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
