'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { apiFetch } from '../lib/api';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Lock, Save } from 'lucide-react';

export default function AccountPage() {
  const { token, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setSaving(true);
    try {
      await apiFetch('/auth/password', {
        method: 'PUT',
        token: token!,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success('تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="الحساب">
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* User info */}
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>معلومات الحساب</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: 12,
                background: 'var(--admin-accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', fontWeight: 700, color: 'var(--admin-accent)',
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{user?.name}</div>
              <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                {user?.email}
              </div>
              <span className="admin-badge admin-badge-accent" style={{ marginTop: 4 }}>
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={18} /> تغيير كلمة المرور
          </h3>

          <form onSubmit={handleChangePassword}>
            <div className="admin-field">
              <label className="admin-label">كلمة المرور الحالية</label>
              <input
                type="password"
                className="admin-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">كلمة المرور الجديدة</label>
              <input
                type="password"
                className="admin-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                className="admin-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
            </button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
