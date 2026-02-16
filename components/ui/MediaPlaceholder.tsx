"use client";

import { ImageIcon, Video, User } from 'lucide-react';

interface MediaPlaceholderProps {
  type?: 'image' | 'video' | 'team';
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const colors = {
  image: { bg: '#1a1a2e', border: '#2a2a4e', text: '#6366f1', icon: '#818cf8' },
  video: { bg: '#1a1e2e', border: '#2a3e4e', text: '#f59e0b', icon: '#fbbf24' },
  team:  { bg: '#1e1a2e', border: '#3e2a4e', text: '#a855f7', icon: '#c084fc' },
};

export default function MediaPlaceholder({ type = 'image', label, className = '', style }: MediaPlaceholderProps) {
  const c = colors[type];
  const Icon = type === 'video' ? Video : type === 'team' ? User : ImageIcon;
  const defaultLabel = type === 'video' ? 'فيديو' : type === 'team' ? 'صورة العضو' : 'صورة';

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 w-full h-full select-none ${className}`}
      style={{
        background: `linear-gradient(135deg, ${c.bg} 0%, ${c.border} 100%)`,
        border: `1px dashed ${c.border}`,
        borderRadius: 'inherit',
        ...style,
      }}
    >
      <Icon size={32} color={c.icon} style={{ opacity: 0.6 }} />
      <span style={{ color: c.text, fontSize: '0.8rem', fontWeight: 500, opacity: 0.8, textAlign: 'center', padding: '0 8px' }}>
        {label || defaultLabel}
      </span>
    </div>
  );
}
