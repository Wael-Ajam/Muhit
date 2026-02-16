"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Wallet, Award, Zap, Palette, ArrowUpRight, Play, Pause } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import Link from 'next/link';

// Feature Item Component with individual scroll tracking
function FeatureItem({ 
  feature, 
  index, 
  total,
  isRTL,
}: { 
  feature: {
    number: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    description: string;
    accentColor: string;
  };
  index: number;
  total: number;
  isRTL: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "center center"]
  });

  // Animate opacity from 0.03 to 0.25 as item scrolls into view
  const numberOpacity = useTransform(scrollYProgress, [0, 1], [0.03, 0.25]);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      {/* Number Background - Giant Watermark with Scroll Color */}
      <motion.div 
        className={`absolute ${isRTL ? 'left-0 sm:left-4 md:left-8 lg:left-0' : 'right-0 sm:right-4 md:right-8 lg:right-0'} -top-4 sm:-top-6 md:-top-8 text-[80px] sm:text-[100px] md:text-[160px] lg:text-[220px] xl:text-[250px] font-black pointer-events-none select-none leading-none z-0`}
        style={{ 
          opacity: numberOpacity,
          color: feature.accentColor,
        }}
        aria-hidden="true"
      >
        {feature.number}
      </motion.div>

      {/* Content - Flat */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 pt-6 sm:pt-8 md:pt-10 lg:pt-12">
        
        {/* Icon */}
        <motion.div 
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${feature.accentColor}, ${feature.accentColor}CC)`,
            boxShadow: `0 15px 40px ${feature.accentColor}20`,
          }}
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.95 }}
        >
          <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" strokeWidth={1.5} />
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-900 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
            {feature.title}
          </h3>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Separator Line */}
      {index < total - 1 && (
        <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 h-px bg-slate-200/60" />
      )}
    </motion.div>
  );
}

export default function Features({ showreelDesktop = '', showreelMobile = '' }: { showreelDesktop?: string; showreelMobile?: string }) {
  const t = useTranslations('Features');
  const { direction, isRTL } = useDirection();
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const showreelRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Parallax effect for header (same style as Footer CTA)
  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end center"]
  });

  const headerY = useTransform(headerScrollProgress, [0, 1], [80, 0]);
  const headerOpacity = useTransform(headerScrollProgress, [0, 0.6], [0, 1]);

  // Showreel parallax
  const { scrollYProgress: showreelScrollProgress } = useScroll({
    target: showreelRef,
    offset: ["start end", "end start"]
  });
  const showreelY = useTransform(showreelScrollProgress, [0, 1], ['-5%', '5%']);
  const showreelScale = useTransform(showreelScrollProgress, [0, 0.5, 1], [1.1, 1.05, 1.1]);

  // Toggle play/pause for both videos
  const togglePlay = useCallback(() => {
    const desktop = videoRef.current;
    const mobile = mobileVideoRef.current;
    
    if (isPlaying) {
      desktop?.pause();
      mobile?.pause();
      setIsPlaying(false);
    } else {
      desktop?.play().catch(() => {});
      mobile?.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Pause video when out of view
  useEffect(() => {
    const video = videoRef.current;
    const mobile = mobileVideoRef.current;
    const target = video || mobile;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            video?.pause();
            mobile?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      number: "01",
      icon: Wallet,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      accentColor: "#F97316",
    },
    {
      number: "02",
      icon: Award,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      accentColor: "#8B5CF6",
    },
    {
      number: "03",
      icon: Zap,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      accentColor: "#06B6D4",
    },
    {
      number: "04",
      icon: Palette,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      accentColor: "#10B981",
    },
  ];

  return (
    <section 
      ref={containerRef}
      data-nav-theme="light"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-32 xl:py-40"
      style={{
        background: '#F8F9FC',
      }}
    >

      {/* ═══════════ SHOWREEL VIDEO ═══════════ */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 mb-16 sm:mb-20 md:mb-28 lg:mb-32">
        <div
          ref={showreelRef}
          className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            height: 'clamp(500px, 90vh, 1100px)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              y: showreelY,
              scale: showreelScale,
            }}
          >
            {/* Desktop Video or Placeholder */}
            {showreelDesktop ? (
              <video
                ref={videoRef}
                className="hidden md:block w-full h-full object-cover"
                loop
                playsInline
                preload="metadata"
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = 'none';
                }}
              >
                <source src={showreelDesktop} type="video/mp4" />
              </video>
            ) : (
              <div className="hidden md:flex w-full h-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1e2e 0%, #0d1b2a 100%)' }}>
                <div className="flex flex-col items-center gap-4 opacity-50">
                  <svg className="w-16 h-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                  <span className="text-amber-300 text-lg font-medium">شوريل سطح المكتب</span>
                </div>
              </div>
            )}

            {/* Mobile Video or Placeholder */}
            {showreelMobile ? (
              <video
                ref={mobileVideoRef}
                className="block md:hidden w-full h-full object-cover"
                loop
                playsInline
                preload="metadata"
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = 'none';
                }}
              >
                <source src={showreelMobile} type="video/mp4" />
              </video>
            ) : (
              <div className="flex md:hidden w-full h-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1e2e 0%, #0d1b2a 100%)' }}>
                <div className="flex flex-col items-center gap-4 opacity-50">
                  <svg className="w-14 h-14 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                  <span className="text-amber-300 text-base font-medium">شوريل الموبايل</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full backdrop-blur-md transition-all duration-300 ${
                isPlaying 
                  ? 'bg-black/20 opacity-0 group-hover:opacity-100' 
                  : 'bg-black/30 border border-white/20 shadow-2xl'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" fill="white" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
              )}
            </motion.div>
          </button>

          {/* Subtle Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.1) 100%)',
            }}
          />
        </div>
      </div>


      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        
        {/* Section Header - Cinematic with Parallax */}
        <motion.div
          ref={headerRef}
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28"
          dir={direction}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
            {/* Title Side */}
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-xs sm:text-sm mb-6 sm:mb-8">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-400 animate-pulse" />
                {t('badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1]">
                <span className="text-slate-800">{t('title')} </span>
                <br />
                <span className="text-orange-500">
                  {t('titleHighlight')}
                </span>
              </h2>
            </div>
            
            {/* Description Side */}
            <div className="lg:max-w-md">
              <p className="text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-6">
                {t('subtitle')}
              </p>
              <Link href="#pricing">
                <motion.div 
                  className="inline-flex items-center gap-2 sm:gap-3 group cursor-pointer"
                  whileHover={{ x: isRTL ? -10 : 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-slate-800 font-medium text-sm sm:text-base group-hover:text-orange-500 transition-colors">
                    {t('discoverMore')}
                  </span>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: '#F97316', boxShadow: '0 6px 20px rgba(249, 115, 22, 0.3)' }}>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Features - Flat Layout with Scroll-based Color */}
        <div className="space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          {features.map((feature, index) => (
            <FeatureItem 
              key={index}
              feature={feature}
              index={index}
              total={features.length}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
