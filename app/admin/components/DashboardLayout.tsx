'use client';

import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Global audio unlock — ensures notification sounds can play
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    ctx.resume().then(() => ctx.close()).catch(() => {});
    // Also pre-load the notification sound
    const a = new Audio('/Muhit-Notification.wav');
    a.volume = 0;
    a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
    document.removeEventListener('mousedown', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('mousedown', unlockAudio, { once: false });
  document.addEventListener('touchstart', unlockAudio, { once: false });
}

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

