import type { Metadata } from 'next';
import './admin.css';
import { AuthProvider } from './lib/auth';
import { NotificationProvider } from './lib/notifications';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'لوحة التحكم | Muhit',
  description: 'لوحة تحكم إدارة محتوى موقع محيط',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="admin-body">
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f0f1a',
                color: '#ffffff',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '14px 20px',
                fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                direction: 'rtl',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#1a1a24' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
