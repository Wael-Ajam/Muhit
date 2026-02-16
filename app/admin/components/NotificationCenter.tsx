'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../lib/notifications';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
} from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'var(--admin-success)',
  error: 'var(--admin-error)',
  warning: 'var(--admin-warning)',
  info: 'var(--admin-info)',
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'الآن';
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} د`;
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} س`;
  return `منذ ${Math.floor(seconds / 86400)} ي`;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="admin-btn admin-btn-ghost"
        onClick={() => setOpen(!open)}
        style={{ position: 'relative' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: 'var(--admin-accent)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 90 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 8,
                width: 360,
                maxHeight: 440,
                background: 'var(--admin-bg-card)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                zIndex: 100,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--admin-border)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  الإشعارات {unreadCount > 0 && `(${unreadCount})`}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {unreadCount > 0 && (
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={markAllAsRead}
                      title="تعليم الكل كمقروء"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={clearAll}
                      title="مسح الكل"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => setOpen(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: '40px 16px',
                      textAlign: 'center',
                      color: 'var(--admin-text-muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Bell size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p>لا توجد إشعارات</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = iconMap[n.type];
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => markAsRead(n.id)}
                        style={{
                          display: 'flex',
                          gap: 10,
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--admin-border)',
                          background: n.read ? 'transparent' : 'rgba(249,115,22,0.04)',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        whileHover={{ background: 'var(--admin-bg-hover)' }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `${colorMap[n.type]}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: colorMap[n.type],
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: n.read ? 400 : 600,
                              marginBottom: 2,
                            }}
                          >
                            {n.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--admin-text-secondary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {n.message}
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--admin-text-muted)',
                              marginTop: 4,
                            }}
                          >
                            {timeAgo(n.timestamp)}
                          </div>
                        </div>
                        {!n.read && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: 'var(--admin-accent)',
                              flexShrink: 0,
                              marginTop: 4,
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
