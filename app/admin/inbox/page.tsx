'use client';

import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { apiFetch } from '../lib/api';
import { useNotifications } from '../lib/notifications';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  Mail,
  Briefcase,
  Star,
  Trash2,
  Clock,
  User,
  Building2,
  Phone,
  AtSign,
  FileText,
  Wallet,
  CalendarDays,
  CheckCheck,
  Circle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InboxMessage {
  id: number;
  type: 'contact' | 'project';
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject?: string;
  message?: string;
  service?: string;
  brief?: string;
  budget?: string;
  deadline?: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'unread' | 'starred' | 'contact' | 'project';

const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'الكل', icon: Inbox },
  { key: 'unread', label: 'غير مقروء', icon: Circle },
  { key: 'starred', label: 'المميزة', icon: Star },
  { key: 'project', label: 'طلبات المشاريع', icon: Briefcase },
  { key: 'contact', label: 'رسائل التواصل', icon: Mail },
];

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
}

export default function InboxPage() {
  const { token } = useAuth();
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InboxMessage | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const latestIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);

  // Initialize notification audio
  useEffect(() => {
    audioRef.current = new Audio('/Muhit-Notification.wav');
    audioRef.current.volume = 0.6;
  }, []);

  // Fetch messages for display (respects current filter)
  const fetchMessages = useCallback(async () => {
    if (!token) return;
    try {
      const filterParam = filter === 'all' ? '' : `?filter=${filter}`;
      const data = await apiFetch<InboxMessage[]>(`/inbox${filterParam}`, { token });
      setMessages(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  // Refs for stable polling closure
  const addNotifRef = useRef(addNotification);
  const fetchMsgsRef = useRef(fetchMessages);
  addNotifRef.current = addNotification;
  fetchMsgsRef.current = fetchMessages;

  // Fetch on filter change
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Single stable polling for new message detection (every 5 seconds)
  useEffect(() => {
    if (!token) return;

    const checkForNew = async () => {
      try {
        const data = await apiFetch<InboxMessage[]>('/inbox', { token });
        const maxId = data.reduce((max, m) => Math.max(max, m.id), 0);

        // First run — just record the latest ID
        if (!initializedRef.current) {
          latestIdRef.current = maxId;
          initializedRef.current = true;
          return;
        }

        if (maxId > latestIdRef.current) {
          // 🔊 Play notification sound twice
          const audio = audioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play().then(() => {
              audio.onended = () => {
                audio.onended = null;
                audio.currentTime = 0;
                audio.play().catch(() => {});
              };
            }).catch(() => {});
          }

          // 🔔 Push to bell notification center
          const newMsgs = data.filter(m => m.id > latestIdRef.current);
          newMsgs.forEach(m => {
            addNotifRef.current(
              'info',
              m.type === 'project' ? '📋 طلب مشروع جديد' : '✉️ رسالة تواصل جديدة',
              `من ${m.name}${m.service ? ` — ${m.service}` : m.subject ? ` — ${m.subject}` : ''}`
            );
          });

          // 📬 Show toast
          toast('📬 رسالة جديدة وصلت!', {
            style: {
              background: '#0f0f1a',
              color: '#ffffff',
              border: '1px solid rgba(249, 115, 22, 0.4)',
            },
          });

          latestIdRef.current = maxId;

          // Refresh the display list
          fetchMsgsRef.current();
        }
      } catch {
        // silently fail
      }
    };

    const interval = setInterval(checkForNew, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // Mark as read when selecting
  const handleSelect = async (msg: InboxMessage) => {
    setSelected(msg);
    if (!msg.isRead && token) {
      try {
        await apiFetch(`/inbox/${msg.id}/read`, { method: 'PATCH', token });
        setMessages(prev =>
          prev.map(m => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch {}
    }
  };

  const handleStar = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    try {
      const updated = await apiFetch<InboxMessage>(`/inbox/${id}/star`, {
        method: 'PATCH',
        token,
      });
      setMessages(prev => prev.map(m => (m.id === id ? updated : m)));
      if (selected?.id === id) setSelected(updated);
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await apiFetch(`/inbox/${id}`, { method: 'DELETE', token });
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      setDeleteConfirm(null);
      toast.success('تم حذف الرسالة');
    } catch {}
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <DashboardLayout title="البريد الوارد">
      <div className="inbox-container">
        {/* ── Left: Message List ── */}
        <div className="inbox-list-panel">
          {/* Filters */}
          <div className="inbox-filters">
            {filters.map(f => {
              const FIcon = f.icon;
              return (
                <button
                  key={f.key}
                  className={`inbox-filter-btn ${filter === f.key ? 'active' : ''}`}
                  onClick={() => { setFilter(f.key); setSelected(null); }}
                >
                  <FIcon size={14} />
                  <span>{f.label}</span>
                  {f.key === 'unread' && unreadCount > 0 && (
                    <span className="inbox-filter-count">{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Message List */}
          <div className="inbox-messages-list">
            {loading ? (
              <div className="inbox-empty">
                <div className="inbox-loading-spinner" />
                <p>جاري تحميل الرسائل...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="inbox-empty">
                <Inbox size={48} strokeWidth={1} />
                <p>لا توجد رسائل</p>
                <span>ستظهر هنا الرسائل الواردة من الموقع</span>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className={`inbox-message-item ${selected?.id === msg.id ? 'selected' : ''} ${!msg.isRead ? 'unread' : ''}`}
                    onClick={() => handleSelect(msg)}
                  >
                    {/* Unread dot */}
                    <div className="inbox-msg-indicator">
                      {!msg.isRead && <span className="inbox-unread-dot" />}
                    </div>

                    {/* Content */}
                    <div className="inbox-msg-content">
                      <div className="inbox-msg-header">
                        <span className="inbox-msg-name">{msg.name}</span>
                        <span className="inbox-msg-time">{timeAgo(msg.createdAt)}</span>
                      </div>
                      <div className="inbox-msg-preview">
                        <span className={`inbox-type-badge ${msg.type}`}>
                          {msg.type === 'project' ? (
                            <><Briefcase size={10} /> طلب مشروع</>
                          ) : (
                            <><Mail size={10} /> تواصل</>
                          )}
                        </span>
                        <span className="inbox-msg-snippet">
                          {msg.type === 'project'
                            ? msg.service || msg.brief || 'طلب مشروع'
                            : msg.subject || msg.message || 'رسالة تواصل'}
                        </span>
                      </div>
                    </div>

                    {/* Star */}
                    <button
                      className={`inbox-star-btn ${msg.isStarred ? 'starred' : ''}`}
                      onClick={(e) => handleStar(msg.id, e)}
                    >
                      <Star size={16} fill={msg.isStarred ? '#eab308' : 'none'} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ── Right: Message Detail ── */}
        <div className="inbox-detail-panel">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="inbox-detail-content"
              >
                {/* Detail Header */}
                <div className="inbox-detail-header">
                  <div className="inbox-detail-title-row">
                    <div>
                      <h2 className="inbox-detail-name">{selected.name}</h2>
                      <span className={`inbox-type-badge ${selected.type} large`}>
                        {selected.type === 'project' ? (
                          <><Briefcase size={12} /> طلب مشروع</>
                        ) : (
                          <><Mail size={12} /> رسالة تواصل</>
                        )}
                      </span>
                    </div>
                    <div className="inbox-detail-actions">
                      <button
                        className={`inbox-star-btn detail ${selected.isStarred ? 'starred' : ''}`}
                        onClick={(e) => handleStar(selected.id, e)}
                      >
                        <Star size={18} fill={selected.isStarred ? '#eab308' : 'none'} />
                      </button>
                      <button
                        className="inbox-delete-btn"
                        onClick={() => setDeleteConfirm(selected.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="inbox-detail-meta">
                    <Clock size={14} />
                    <span>{new Date(selected.createdAt).toLocaleString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                </div>

                {/* Detail Fields */}
                <div className="inbox-detail-fields">
                  <div className="inbox-field">
                    <div className="inbox-field-icon"><User size={16} /></div>
                    <div className="inbox-field-data">
                      <span className="inbox-field-label">الاسم</span>
                      <span className="inbox-field-value">{selected.name}</span>
                    </div>
                  </div>

                  <div className="inbox-field">
                    <div className="inbox-field-icon"><AtSign size={16} /></div>
                    <div className="inbox-field-data">
                      <span className="inbox-field-label">البريد الإلكتروني</span>
                      <a href={`mailto:${selected.email}`} className="inbox-field-value link" dir="ltr">
                        {selected.email}
                      </a>
                    </div>
                  </div>

                  {selected.phone && (
                    <div className="inbox-field">
                      <div className="inbox-field-icon"><Phone size={16} /></div>
                      <div className="inbox-field-data">
                        <span className="inbox-field-label">رقم التواصل</span>
                        <a href={`tel:${selected.phone}`} className="inbox-field-value link" dir="ltr">
                          {selected.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selected.organization && (
                    <div className="inbox-field">
                      <div className="inbox-field-icon"><Building2 size={16} /></div>
                      <div className="inbox-field-data">
                        <span className="inbox-field-label">الجهة</span>
                        <span className="inbox-field-value">{selected.organization}</span>
                      </div>
                    </div>
                  )}

                  {selected.service && (
                    <div className="inbox-field">
                      <div className="inbox-field-icon"><Briefcase size={16} /></div>
                      <div className="inbox-field-data">
                        <span className="inbox-field-label">الخدمة المطلوبة</span>
                        <span className="inbox-field-value highlight">{selected.service}</span>
                      </div>
                    </div>
                  )}

                  {selected.subject && (
                    <div className="inbox-field">
                      <div className="inbox-field-icon"><FileText size={16} /></div>
                      <div className="inbox-field-data">
                        <span className="inbox-field-label">الموضوع</span>
                        <span className="inbox-field-value">{selected.subject}</span>
                      </div>
                    </div>
                  )}

                  {selected.budget && (
                    <div className="inbox-field">
                      <div className="inbox-field-icon"><Wallet size={16} /></div>
                      <div className="inbox-field-data">
                        <span className="inbox-field-label">الميزانية</span>
                        <span className="inbox-field-value">{selected.budget}</span>
                      </div>
                    </div>
                  )}

                  {selected.deadline && (
                    <div className="inbox-field">
                      <div className="inbox-field-icon"><CalendarDays size={16} /></div>
                      <div className="inbox-field-data">
                        <span className="inbox-field-label">تاريخ التسليم المتوقع</span>
                        <span className="inbox-field-value">{selected.deadline}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message / Brief */}
                {(selected.message || selected.brief) && (
                  <div className="inbox-detail-message">
                    <h4>
                      <FileText size={16} />
                      {selected.type === 'project' ? 'نبذة عن المشروع' : 'الرسالة'}
                    </h4>
                    <p>{selected.message || selected.brief}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="inbox-quick-actions">
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inbox-action-btn whatsapp"
                    >
                      <Phone size={16} />
                      <span>واتساب</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inbox-detail-empty"
              >
                <div className="inbox-detail-empty-icon">
                  <CheckCheck size={48} strokeWidth={1} />
                </div>
                <h3>اختر رسالة لعرض التفاصيل</h3>
                <p>اختر رسالة من القائمة لعرض كامل التفاصيل والرد عليها</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-overlay"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="admin-modal"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 400 }}
            >
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Trash2 size={24} style={{ color: 'var(--admin-error)' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
                  حذف الرسالة؟
                </h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
                  سيتم حذف هذه الرسالة نهائياً ولا يمكن استعادتها
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    إلغاء
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(deleteConfirm)}
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
