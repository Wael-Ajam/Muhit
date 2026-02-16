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
            position="top-left"
            toastOptions={{
              style: {
                background: '#1a1a24',
                color: '#f0f0f5',
                border: '1px solid #2a2a3a',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                direction: 'rtl',
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
