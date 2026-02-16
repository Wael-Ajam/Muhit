"use client";

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, ArrowUpLeft, ArrowUpRight, Filter, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from '@/i18n/navigation';

import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { trackButtonClick } from '@/app/hooks/useAnalytics';
import { ApiProject, localize } from '@/lib/types';

const DarkVeil = dynamic(() => import('@/components/effects/DarkVeil'), { ssr: false });

// Filter categories
const categories = [
  { id: 'all', labelKey: 'filterAll' },
  { id: 'marketing', labelKey: 'filterMarketing' },
  { id: 'design', labelKey: 'filterDesign' },
  { id: 'development', labelKey: 'filterDevelopment' },
  { id: 'motion', labelKey: 'filterMotion' },
];

// Project Card Component
function ProjectCard({ 
  project, 
  index, 
  isRTL, 
  t, 
}: { 
  project: {
    id: number;
    title: string;
    slug: string;
    category: string;
    tags: string[];
    image: string;
    video: string | null;
    isVideo: boolean;
    description: string;
  }; 
  index: number;
  isRTL: boolean;
  t: (key: string) => string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && project.video) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && project.video) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
      style={{ height: 'clamp(650px, 85vh, 1150px)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-slate-800 transition-all duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
        style={{
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Video Layer */}
      {project.video && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          onError={(e) => {
            (e.target as HTMLVideoElement).style.display = 'none';
          }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div 
        className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-80' : 'opacity-60'}`}
      />



      {/* Video Play Icon */}
      {project.isVideo && (
        <div className={`absolute top-5 ${isRTL ? 'left-5 md:left-7' : 'right-5 md:right-7'} md:top-7 z-10`}>
          <motion.div 
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-500 ${
              isHovered ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-white/10 border border-white/20'
            }`}
            animate={{ scale: isHovered ? 1.1 : 1 }}
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
          </motion.div>
        </div>
      )}

      {/* Category Badge - Top Left */}
      <div className={`absolute top-5 ${isRTL ? 'right-5 md:right-7' : 'left-5 md:left-7'} md:top-7 z-10`}>
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-white/10 backdrop-blur-xl text-white/80 border border-white/15"
        >
          {t(`filter${project.category.charAt(0).toUpperCase() + project.category.slice(1)}`)}
        </motion.span>
      </div>

      {/* Content - Glassmorphism Card */}
      <div className={`absolute bottom-5 ${isRTL ? 'right-5 md:right-7' : 'left-5 md:left-7'} md:bottom-7 z-10 w-[75%] md:w-[65%] lg:w-[55%]`}>
        <div 
          className={`relative p-5 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-500 overflow-hidden ${isHovered ? 'scale-[1.02]' : 'scale-100'}`}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Ribbed Glass Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 8px,
                rgba(255, 255, 255, 0.08) 8px,
                rgba(255, 255, 255, 0.08) 10px
              )`,
            }}
          />

          {/* Inner Glow on Hover */}
          <div
            className={`absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'radial-gradient(ellipse at center bottom, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
            }}
          />

          {/* Content wrapper */}
          <div className="relative z-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1 text-[10px] md:text-xs font-medium rounded-full transition-colors duration-300 ${isHovered ? 'bg-orange-500/15 text-orange-300 border border-orange-500/25' : 'bg-white/10 text-white/70 border border-white/15'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Project Title */}
            <h3 
              className={`text-lg md:text-xl lg:text-2xl font-bold mb-2 transition-colors duration-500 ${isHovered ? 'text-orange-400' : 'text-white'}`}
            >
              {project.title}
            </h3>
            
            {/* Description */}
            <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Bottom Row: View Project + Arrow */}
            <div className="flex items-center justify-between">
              <Link 
                href={`/portfolio/${project.slug}`}
                className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  isHovered ? 'text-orange-400' : 'text-white/60'
                }`}
              >
                {t('viewProject')}
                <motion.span
                  animate={{ x: isHovered ? (isRTL ? -4 : 4) : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  →
                </motion.span>
              </Link>
              <Link 
                href={`/portfolio/${project.slug}`}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isHovered ? 'bg-orange-500 shadow-lg shadow-orange-500/30 scale-110' : 'bg-white/10'
                }`}
              >
                <ArrowUpLeft className={`w-4 h-4 md:w-5 md:h-5 text-white transform ${isRTL ? '-rotate-90' : 'rotate-90'}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioClient({ projects: apiProjects, locale }: { projects: ApiProject[]; locale: string }) {
  const t = useTranslations('PortfolioPage');
  const { isRTL, direction } = useDirection();
  const [activeFilter, setActiveFilter] = useState('all');
  const heroRef = useRef<HTMLElement>(null);

  // Parallax for hero — only Y offset and opacity, no scale (GPU-expensive)
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);

  // Hide heavy global overlays (GradientBlobs + DynamicBottomBlur) on portfolio page
  useEffect(() => {
    const blobs = document.querySelector('.fixed.inset-0.z-0') as HTMLElement;
    const bottomBlur = document.querySelector('.gradual-blur-page')?.closest('div') as HTMLElement;
    
    if (blobs) blobs.style.display = 'none';
    if (bottomBlur) bottomBlur.style.display = 'none';
    
    return () => {
      if (blobs) blobs.style.display = '';
      if (bottomBlur) bottomBlur.style.display = '';
    };
  }, []);

  // Map API projects to display format
  const projects = useMemo(() => apiProjects.map(p => ({
    id: p.id,
    title: localize(p, 'title', locale),
    slug: p.slug,
    category: p.category,
    tags: p.tags.map(tag => t(tag.tagKey)),
    image: p.coverImage,
    video: p.coverVideo,
    isVideo: p.isVideo,
    description: localize(p, 'desc', locale),
  })), [apiProjects, locale, t]);

  // Filter projects
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <>
      {/* ============================================ */}
      {/*  HERO SECTION - Cinematic Full Viewport      */}
      {/* ============================================ */}
      <section 
        ref={heroRef}
        data-nav-theme="dark"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#0a0a1f' }}
      >

        {/* DarkVeil Background Effect */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }}>
          <DarkVeil
            speed={0.5}
            noiseIntensity={0}
            scanlineIntensity={0}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>

        {/* Gradient Orbs — static for performance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4), transparent)' }}
          />
          <div 
            className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)' }}
          />
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 w-full px-6 md:px-12 lg:px-24 max-w-6xl mx-auto text-center" 
          style={{ direction, y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <span 
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(249, 115, 22, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                }}
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400">{t('badge')}</span>
              </span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] mb-6"
            >
              <span className="text-white block">{t('heroTitle')}</span>
              <span className="text-orange-500">{t('heroTitleHighlight')}</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center gap-10 md:gap-16"
            >
              {[
                { value: '50+', label: t('statProjects') },
                { value: '30+', label: t('statClients') },
                { value: '5+', label: t('statYears') },
              ].map((stat, i) => (
                <div key={i} className="relative">
                  <motion.div 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F97316]"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.15, duration: 0.5, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm md:text-base text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/*  PROJECTS SECTION                            */}
      {/* ============================================ */}
      <section 
        data-nav-theme="dark"
        className="py-20 md:py-32 px-6 lg:px-24 relative overflow-hidden"
        style={{ background: '#0a0a1f' }}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-40 -right-60 w-[500px] h-[500px] rounded-full blur-[200px] opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(243, 129, 32, 0.4) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute bottom-40 -left-60 w-[400px] h-[400px] rounded-full blur-[200px] opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)' }}
          />
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 md:mb-20"
            style={{ direction }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-white">{t('sectionTitle')} </span>
              <span className="text-orange-500">{t('sectionTitleHighlight')}</span>
            </h2>
            <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto">
              {t('sectionSubtitle')}
            </p>
          </motion.div>

          {/* Filter Bar - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-14"
            style={{ direction }}
          >
            <div className="hidden md:flex items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`relative px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-500 ${
                    activeFilter === cat.id
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {/* Active background */}
                  {activeFilter === cat.id && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: '#F97316',
                        boxShadow: '0 8px 30px rgba(249, 115, 22, 0.3)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Inactive background */}
                  {activeFilter !== cat.id && (
                    <div 
                      className="absolute inset-0 rounded-full transition-colors duration-300"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    />
                  )}
                  <span className="relative z-10">{t(cat.labelKey)}</span>
                </button>
              ))}
            </div>

            {/* Filter - Mobile */}
            <div className="md:hidden flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === cat.id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white/5 text-white/50 border border-white/10'
                  }`}
                >
                  {t(cat.labelKey)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid - Clean Uniform Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isRTL={isRTL}
                  t={t}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Filter className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/30 text-lg">{t('noResults')}</p>
            </motion.div>
          )}
        </div>
      </section>


      {/* ============================================ */}
      {/*  CTA SECTION - White/Silver Theme            */}
      {/* ============================================ */}
      <section 
        data-nav-theme="light"
        className="relative py-28 md:py-40 px-6 lg:px-24 overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, #f5f5f7 0%, #e8e8ec 50%, #dddde3 100%)',
        }}
      >
        {/* Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft Radial Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.8), transparent 70%)' }}
          />
        </div>

        {/* Content - Centered */}
        <div className="relative z-10 max-w-4xl mx-auto text-center" style={{ direction }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span 
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-orange-600"
              style={{
                background: 'rgba(249, 115, 22, 0.08)',
                border: '1px solid rgba(249, 115, 22, 0.15)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-[#1a1a2e]">{t('ctaTitle')}</span>{' '}
            <span className="text-orange-500">{t('ctaTitleHighlight')}</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#1a1a2e]/45 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t('ctaSubtitle')}
          </motion.p>

          {/* CTA Button - Pill Shape */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link href="#contact" onClick={() => trackButtonClick('portfolio-cta-contact', '/portfolio', 'تواصل معنا - الأعمال')}>
              <motion.div
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#1a1a2e] text-white font-semibold text-lg cursor-pointer group"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(26, 26, 46, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {t('ctaButton')}
                <motion.div
                  className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"
                  animate={{ x: 0 }}
                  whileHover={{ rotate: -45 }}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer hideCTA />
    </>
  );
}
