'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Image,
  Eye,
  Star,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface Project {
  id: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  coverImage: string;
  gallery: { id: number }[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<Project[]>('/projects', { token })
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const stats = [
    {
      label: 'إجمالي المشاريع',
      value: projects.length,
      icon: FolderKanban,
      color: '#f97316',
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))',
      border: 'rgba(249, 115, 22, 0.2)',
    },
    {
      label: 'المشاريع المنشورة',
      value: projects.filter((p) => p.isPublished).length,
      icon: Eye,
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
      border: 'rgba(34, 197, 94, 0.2)',
    },
    {
      label: 'المشاريع المميزة',
      value: projects.filter((p) => p.isFeatured).length,
      icon: Star,
      color: '#eab308',
      gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05))',
      border: 'rgba(234, 179, 8, 0.2)',
    },
    {
      label: 'عناصر المعرض',
      value: projects.reduce((acc, p) => acc + (p.gallery?.length || 0), 0),
      icon: Image,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
      border: 'rgba(59, 130, 246, 0.2)',
    },
  ];

  return (
    <DashboardLayout title="لوحة التحكم">
      {loading ? (
        <div style={{ color: 'var(--admin-text-muted)', padding: 40, textAlign: 'center' }}>
          جاري تحميل البيانات...
        </div>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            className="admin-stats-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="dashboard-stat-card"
                style={{
                  background: stat.gradient,
                  borderColor: stat.border,
                }}
              >
                <div
                  className="dashboard-stat-icon"
                  style={{
                    color: stat.color,
                    background: `${stat.color}15`,
                  }}
                >
                  <stat.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="dashboard-stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="dashboard-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent projects */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            style={{ marginTop: 36 }}
          >
            <div className="dashboard-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={20} style={{ color: 'var(--admin-accent)' }} />
                <h3>آخر المشاريع</h3>
              </div>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => router.push('/admin/projects')}
              >
                <span>عرض الكل</span>
                <ArrowLeft size={14} />
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المشروع</th>
                    <th>التصنيف</th>
                    <th>الحالة</th>
                    <th>المعرض</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map((project, i) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="dashboard-table-row"
                      onClick={() => router.push(`/admin/projects/${project.id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.coverImage}
                            alt=""
                            className="dashboard-project-thumb"
                          />
                          <div>
                            <div className="dashboard-project-title">{project.titleAr}</div>
                            <div className="dashboard-project-slug">{project.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-accent">{project.category}</span>
                      </td>
                      <td>
                        <span className={`admin-badge ${project.isPublished ? 'admin-badge-success' : 'admin-badge-muted'}`}>
                          {project.isPublished ? 'منشور' : 'مسودة'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>
                        {project.gallery?.length || 0} عنصر
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </DashboardLayout>
  );
}
