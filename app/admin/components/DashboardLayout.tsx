'use client';

import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children, title = 'لوحة التحكم' }: {
  children: React.ReactNode;
  title?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: 'var(--admin-text-muted)',
      }}>
        جاري التحميل...
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Sidebar />
      <Header title={title} />
      <main className="admin-content">
        {children}
      </main>
    </>
  );
}
