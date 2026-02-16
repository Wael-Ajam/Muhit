'use client';

import { Menu } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  title: string;
  onMenuToggle?: () => void;
}

export default function Header({ title, onMenuToggle }: HeaderProps) {
  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onMenuToggle && (
          <button className="admin-btn admin-btn-ghost" onClick={onMenuToggle}>
            <Menu size={20} />
          </button>
        )}
        <h2 className="admin-header-title">{title}</h2>
      </div>

      <div className="admin-header-actions">
        <NotificationCenter />
      </div>
    </header>
  );
}
