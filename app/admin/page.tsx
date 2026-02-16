'use client';

import { useState } from 'react';
import { useAuth } from './lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowLeft, Loader } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  // If already logged in, redirect
  if (!isLoading && user) {
    router.push('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-login-page">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        >
          <Loader size={28} style={{ color: 'var(--admin-accent)' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      {/* Login card */}
      <motion.div
        className="login-card-premium"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo + brand */}
        <motion.div
          className="login-brand"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="login-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/muhit-logo-white.png"
              alt="Muhit"
              className="login-logo-img"
            />
          </div>
          <div className="login-brand-text">
            <h1>لوحة التحكم</h1>
            <p>مرحباً بك في نظام إدارة محيط</p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="login-divider">
          <span>تسجيل الدخول</span>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            className="login-error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="login-error-icon">!</span>
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={`login-field ${focused === 'email' ? 'login-field-focused' : ''}`}>
            <div className="login-field-icon">
              <Mail size={18} />
            </div>
            <input
              type="email"
              className="login-field-input"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              required
              autoFocus
              dir="ltr"
            />
          </div>

          <div className={`login-field ${focused === 'password' ? 'login-field-focused' : ''}`}>
            <div className="login-field-icon">
              <Lock size={18} />
            </div>
            <input
              type="password"
              className="login-field-input"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              required
              dir="ltr"
            />
          </div>

          <motion.button
            type="submit"
            className="login-submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'flex' }}
              >
                <Loader size={20} />
              </motion.div>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <div className="login-footer-line" />
          <p>Muhit Solution © {new Date().getFullYear()}</p>
        </div>
      </motion.div>
    </div>
  );
}
