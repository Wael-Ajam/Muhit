'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth';
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'المشاريع', icon: FolderKanban },
  { href: '/admin/categories', label: 'التصنيفات', icon: Tags },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/admin/settings', label: 'إعدادات الموقع', icon: Settings },
  { href: '/admin/account', label: 'الحساب', icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      {/* Logo */}
      <div className="admin-sidebar-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/muhit-logo-white.png"
          alt="Muhit"
          style={{
            height: 28,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
              {isActive && (
                <ChevronLeft
                  style={{ marginRight: 'auto', width: 16, height: 16, opacity: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="admin-nav-bottom">
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--admin-bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--admin-text-secondary)',
              }}
            >
              {user.name?.charAt(0) || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                {user.role}
              </div>
            </div>
          </div>
        )}
        <button className="admin-nav-item" onClick={logout}>
          <LogOut />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
