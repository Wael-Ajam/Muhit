'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, ChevronUp, Volume2, VolumeX, Home, Briefcase, CreditCard, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import { Link } from '@/i18n/navigation';
import './reels.css';

interface ReelProject {
  id: number;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  image: string;
  video: string | null;
  isVideo: boolean;
  description: string;
}

export default function ReelsClient() {
  const t = useTranslations('PortfolioPage');
  const { isRTL } = useDirection();

  const projects: ReelProject[] = [
    {
      id: 1,
      title: t('project1Title'),
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion'), t('tagDesign'), t('tagMarketing')],
      image: '',
      video: '',
      isVideo: true,
      description: t('project1Desc'),
    },
    {
      id: 10,
      title: 'وسم الصبا — حفل التكريم',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion'), t('tagDesign')],
      image: '',
      video: '',
      isVideo: true,
      description: 'فيديو حفل تكريم جمعية وسم الصبا',
    },
    {
      id: 11,
      title: 'وسم الصبا — جائزة التميز',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion'), t('tagMarketing')],
      image: '',
      video: '',
      isVideo: true,
      description: 'فيديو جائزة التميز — وسم الصبا',
    },
    {
      id: 12,
      title: 'وسم الصبا — الجائزة ٢',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion'), t('tagDesign')],
      image: '',
      video: '',
      isVideo: true,
      description: 'تصميم موشن للجائزة — النسخة الثانية',
    },
    {
      id: 13,
      title: 'وسم الصبا — الجائزة ٣',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion'), t('tagMarketing')],
      image: '',
      video: '',
      isVideo: true,
      description: 'تصميم موشن للجائزة — النسخة الثالثة',
    },
    {
      id: 14,
      title: 'وسم الصبا — الجائزة ٤',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion'), t('tagDesign')],
      image: '',
      video: '',
      isVideo: true,
      description: 'تصميم موشن للجائزة — النسخة الرابعة',
    },
    {
      id: 15,
      title: 'وسم الصبا — الحفل',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion')],
      image: '',
      video: '',
      isVideo: true,
      description: 'لحظات من حفل وسم الصبا',
    },
    {
      id: 16,
      title: 'وسم الصبا — الحفل ٢',
      slug: 'integrated-ad-campaign',
      category: 'motion',
      tags: [t('tagMotion')],
      image: '',
      video: '',
      isVideo: true,
      description: 'لحظات من حفل وسم الصبا — الجزء الثاني',
    },
    {
      id: 17,
      title: 'وسم الصبا — الغلاف',
      slug: 'integrated-ad-campaign',
      category: 'design',
      tags: [t('tagDesign'), t('tagMarketing')],
      image: '',
      video: null,
      isVideo: false,
      description: 'تصميم غلاف مشروع وسم الصبا',
    },
    {
      id: 2,
      title: t('project2Title'),
      slug: 'full-brand-identity',
      category: 'design',
      tags: [t('tagDesign'), t('tagVisualIdentity'), t('tagDevelopment')],
      image: '',
      video: '',
      isVideo: true,
      description: t('project2Desc'),
    },
    {
      id: 3,
      title: t('project3Title'),
      slug: 'motion-promo-video',
      category: 'motion',
      tags: [t('tagMotion'), t('tagDesign'), t('tagMarketing')],
      image: '',
      video: '',
      isVideo: true,
      description: t('project3Desc'),
    },
    {
      id: 4,
      title: t('project4Title'),
      slug: 'advanced-ecommerce-store',
      category: 'development',
      tags: [t('tagDevelopment'), t('tagDesign'), t('tagEcommerce')],
      image: '',
      video: null,
      isVideo: false,
      description: t('project4Desc'),
    },
    {
      id: 5,
      title: t('project5Title'),
      slug: 'mobile-app',
      category: 'development',
      tags: [t('tagDevelopment'), t('tagDesign'), t('tagUIUX')],
      image: '',
      video: null,
      isVideo: false,
      description: t('project5Desc'),
    },
    {
      id: 6,
      title: t('project6Title'),
      slug: 'social-media-campaign',
      category: 'marketing',
      tags: [t('tagMarketing'), t('tagDesign'), t('tagAdCampaigns')],
      image: '',
      video: '',
      isVideo: true,
      description: t('project6Desc'),
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(() => {
    const counts: Record<number, number> = {};
    projects.forEach((p) => { counts[p.id] = Math.floor(Math.random() * 50) + 10; });
    return counts;
  });
  const [muted, setMuted] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const lastTapRef = useRef<number>(0);
  const [commentText, setCommentText] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});

  // Fake comments per project
  const [comments, setComments] = useState<Record<number, { id: string; user: string; avatar: string; text: string; time: string; likes: number }[]>>(() => {
    const fakeComments: Record<number, { id: string; user: string; avatar: string; text: string; time: string; likes: number }[]> = {};
    const sampleComments = [
      { user: 'أحمد الشمري', avatar: 'أ', text: 'ماشاء الله عمل رائع 🔥', time: '٢ س', likes: 12 },
      { user: 'سارة العتيبي', avatar: 'س', text: 'إبداع بكل معنى الكلمة ❤️', time: '٣ س', likes: 8 },
      { user: 'محمد الحربي', avatar: 'م', text: 'يعطيكم العافية، شغل احترافي', time: '٥ س', likes: 5 },
      { user: 'نورة القحطاني', avatar: 'ن', text: 'وش هالجمال! كيف أقدر أطلب مشروع مشابه؟', time: '٧ س', likes: 15 },
      { user: 'خالد المالكي', avatar: 'خ', text: 'أفضل وكالة تصميم شفتها 👏', time: '١ ي', likes: 22 },
      { user: 'ريم السبيعي', avatar: 'ر', text: 'التصوير والإخراج مبدع جداً', time: '١ ي', likes: 3 },
    ];
    projects.forEach((p) => {
      const count = 2 + Math.floor(Math.random() * 4);
      const shuffled = [...sampleComments].sort(() => Math.random() - 0.5);
      fakeComments[p.id] = shuffled.slice(0, count).map((c, i) => ({ ...c, id: `${p.id}-${i}` }));
    });
    return fakeComments;
  });

  // ── Track active slide via Intersection Observer ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slides = container.querySelectorAll('.reel-slide');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
            setShowSwipeHint(idx === 0);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  // ── Auto-play/pause videos based on active slide ──
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  // ── Video progress tracking ──
  useEffect(() => {
    const video = videoRefs.current[activeIndex];
    if (!video) { setVideoProgress(0); return; }

    const update = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener('timeupdate', update);
    return () => video.removeEventListener('timeupdate', update);
  }, [activeIndex]);

  // ── Hide heavy global overlays ──
  useEffect(() => {
    const blobs = document.querySelector('.fixed.inset-0.z-0') as HTMLElement;
    const bottomBlur = document.querySelector('.gradual-blur-page')?.closest('div') as HTMLElement;
    if (blobs) blobs.style.display = 'none';
    if (bottomBlur) bottomBlur.style.display = 'none';
    // Hide navbar on this page for immersive experience
    const navbar = document.querySelector('header') as HTMLElement;
    if (navbar) navbar.style.display = 'none';

    return () => {
      if (blobs) blobs.style.display = '';
      if (bottomBlur) bottomBlur.style.display = '';
      if (navbar) navbar.style.display = '';
    };
  }, []);

  // ── Like ──
  const toggleLike = useCallback((id: number) => {
    setLikes((prev) => {
      const wasLiked = prev[id];
      setLikeCounts((c) => ({
        ...c,
        [id]: (c[id] || 0) + (wasLiked ? -1 : 1),
      }));
      return { ...prev, [id]: !wasLiked };
    });
  }, []);

  // ── Double-tap to like ──
  const handleDoubleTap = useCallback((id: number) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!likes[id]) toggleLike(id);
      setDoubleTapHeart(id);
      setTimeout(() => setDoubleTapHeart(null), 900);
    }
    lastTapRef.current = now;
  }, [likes, toggleLike]);

  // ── Scroll to dot ──
  const scrollToSlide = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const slide = container.children[index] as HTMLElement;
    slide?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="reels-page" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Sidebar (desktop only) ── */}
      <div className="reels-sidebar">
        <div className="reels-sidebar-logo">محيط</div>
        <Link href="/" className="reels-sidebar-link">
          <Home size={20} /> {isRTL ? 'الرئيسية' : 'Home'}
        </Link>
        <Link href="/portfolio" className="reels-sidebar-link active">
          <Briefcase size={20} /> {isRTL ? 'أعمالنا' : 'Portfolio'}
        </Link>
        <Link href="/pricing" className="reels-sidebar-link">
          <CreditCard size={20} /> {isRTL ? 'الباقات' : 'Pricing'}
        </Link>
        <Link href="https://calendly.com/muhitsolution-info/30min" target="_blank" rel="noopener noreferrer" className="reels-sidebar-link">
          <Mail size={20} /> {isRTL ? 'تواصل' : 'Contact'}
        </Link>
      </div>

      {/* ── Navigation Dots (outside scroll) ── */}
      <div className="reel-nav-dots">
        {projects.map((_, i) => (
          <button
            key={i}
            className={`reel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => scrollToSlide(i)}
          />
        ))}
      </div>

      {/* ── Scroll Container ── */}
      <div className="reels-container" ref={containerRef}>
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="reel-slide"
          data-index={index}
          onClick={() => handleDoubleTap(project.id)}
        >
          {/* ── Media ── */}
          {project.isVideo && project.video ? (
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              className="reel-media"
              src={project.video}
              poster={project.image || undefined}
              muted={muted}
              playsInline
              preload="metadata"
              onEnded={() => {
                const nextIdx = index < projects.length - 1 ? index + 1 : 0;
                scrollToSlide(nextIdx);
              }}
            />
          ) : project.image ? (
            <img
              className="reel-media"
              src={project.image}
              alt={project.title}
              draggable={false}
            />
          ) : (
            <div className="reel-media" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ opacity: 0.4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                <span style={{ color: '#a5b4fc', fontSize: '14px', fontWeight: 500 }}>{project.title}</span>
              </div>
            </div>
          )}

          {/* ── Dark gradient overlay ── */}
          <div className="reel-media-overlay" />

          {/* ── Double-tap heart animation ── */}
          <AnimatePresence>
            {doubleTapHeart === project.id && (
              <div className="reel-double-tap-heart">
                <Heart size={80} fill="#ff2d55" strokeWidth={0} />
              </div>
            )}
          </AnimatePresence>

          {/* ── Video progress bar ── */}
          {project.isVideo && project.video && index === activeIndex && (
            <div className="reel-progress">
              <div className="reel-progress-bar" style={{ width: `${videoProgress}%` }} />
            </div>
          )}

          {/* ── Sound toggle (for videos) ── */}
          {project.isVideo && project.video && index === activeIndex && (
            <button
              className="reel-sound-btn"
              onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}

          {/* ── Bottom Info ── */}
          <motion.div
            className="reel-info"
            initial={{ opacity: 0, y: 30 }}
            animate={index === activeIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="reel-project-title">{project.title}</h2>
            <p className="reel-project-desc">{project.description}</p>
            <div className="reel-tags">
              {project.tags.map((tag, i) => (
                <span key={i} className="reel-tag">#{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* ── Side Action Bar ── */}
          <motion.div
            className="reel-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={index === activeIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {/* Like */}
            <button
              className={`reel-action-btn ${likes[project.id] ? 'liked' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleLike(project.id); }}
            >
              <div className="reel-action-icon">
                <Heart size={22} fill={likes[project.id] ? '#ff2d55' : 'none'} />
              </div>
              <span className="reel-action-label">{likeCounts[project.id] || 0}</span>
            </button>

            {/* Comment */}
            <button
              className="reel-action-btn"
              onClick={(e) => { e.stopPropagation(); setCommentOpen(true); }}
            >
              <div className="reel-action-icon">
                <MessageCircle size={22} />
              </div>
              <span className="reel-action-label">{isRTL ? 'تعليق' : 'Comment'}</span>
            </button>

            {/* Request Project */}
            <Link
              href="https://calendly.com/muhitsolution-info/30min" target="_blank" rel="noopener noreferrer"
              className="reel-action-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="reel-action-icon" style={{ background: 'rgba(249, 115, 22, 0.2)', borderColor: 'rgba(249, 115, 22, 0.4)' }}>
                <Send size={20} style={{ color: '#f97316' }} />
              </div>
              <span className="reel-action-label">{isRTL ? 'اطلب' : 'Request'}</span>
            </Link>
          </motion.div>

          {/* ── Swipe hint (first slide only) ── */}
          {index === 0 && showSwipeHint && (
            <div className="reel-swipe-hint">
              <ChevronUp size={20} />
              <span>{isRTL ? 'اسحب للأعلى' : 'Swipe up'}</span>
            </div>
          )}
        </div>
      ))}
      </div>

      {/* ── Comment Sheet ── */}
      <AnimatePresence>
        {commentOpen && (
          <motion.div
            className="reel-comment-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommentOpen(false)}
          >
            <motion.div
              className="reel-comment-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="reel-comment-handle" />

              <div className="reel-comment-header">
                <h3>{isRTL ? 'التعليقات' : 'Comments'}</h3>
                <span className="reel-comment-count">
                  {comments[projects[activeIndex]?.id]?.length || 0}
                </span>
              </div>

              <div className="reel-comment-list">
                {(comments[projects[activeIndex]?.id] || []).map((c) => (
                  <div key={c.id} className="reel-comment-item">
                    <div className="reel-comment-avatar">{c.avatar}</div>
                    <div className="reel-comment-content">
                      <div className="reel-comment-username">{c.user}</div>
                      <div className="reel-comment-text">{c.text}</div>
                      <div className="reel-comment-meta">
                        <span>{c.time}</span>
                        <button className="reel-comment-meta-btn">
                          {isRTL ? 'رد' : 'Reply'}
                        </button>
                      </div>
                    </div>
                    <button
                      className={`reel-comment-like-btn ${commentLikes[c.id] ? 'liked' : ''}`}
                      onClick={() => setCommentLikes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                    >
                      <Heart size={12} fill={commentLikes[c.id] ? '#ff2d55' : 'none'} stroke={commentLikes[c.id] ? '#ff2d55' : 'rgba(255,255,255,0.5)'} />
                      <span>{c.likes + (commentLikes[c.id] ? 1 : 0)}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="reel-comment-input-row">
                <div className="reel-comment-my-avatar">أ</div>
                <input
                  className="reel-comment-input"
                  placeholder={isRTL ? 'أضف تعليقاً...' : 'Add a comment...'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && commentText.trim()) {
                      const pid = projects[activeIndex]?.id;
                      if (!pid) return;
                      setComments(prev => ({
                        ...prev,
                        [pid]: [{ id: `new-${Date.now()}`, user: 'أنت', avatar: 'أ', text: commentText.trim(), time: 'الآن', likes: 0 }, ...(prev[pid] || [])],
                      }));
                      setCommentText('');
                    }
                  }}
                />
                <button
                  className={`reel-comment-send ${commentText.trim() ? 'active' : ''}`}
                  onClick={() => {
                    if (!commentText.trim()) return;
                    const pid = projects[activeIndex]?.id;
                    if (!pid) return;
                    setComments(prev => ({
                      ...prev,
                      [pid]: [{ id: `new-${Date.now()}`, user: 'أنت', avatar: 'أ', text: commentText.trim(), time: 'الآن', likes: 0 }, ...(prev[pid] || [])],
                    }));
                    setCommentText('');
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
