"use client";

import { motion } from 'framer-motion';
import { ArrowUpLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import { ApiProject, localize } from '@/lib/types';

interface PortfolioSectionProps {
  projects?: ApiProject[];
  locale?: string;
}

export default function PortfolioSection({ projects: apiProjects = [], locale = 'ar' }: PortfolioSectionProps) {
  const t = useTranslations('Portfolio');
  const { isRTL } = useDirection();

  // Map API projects to display format
  const projects = apiProjects.map(p => ({
    id: p.id,
    title: localize(p, 'title', locale),
    slug: p.slug,
    categories: p.categories.map(c => c.categorySlug),
    tags: p.tags.map(tag => t(tag.tagKey)),
    image: p.coverImage,
    video: p.coverVideo,
    isVideo: p.isVideo,
    description: localize(p, 'desc', locale),
    logo: p.logo,
  }));

  // Project Card Component with Video Support
  function ProjectCard({ 
    project, 
    index 
  }: { 
    project: typeof projects[0]; 
    index: number;
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
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
        style={{ height: 'clamp(400px, 70vh, 1150px)' }}
        data-cursor-text={t('explore')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image or Placeholder */}
        <div 
          className={`absolute inset-0 transition-all duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          style={{
            ...(project.image ? {
              backgroundImage: `url(${project.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }),
          }}
        >
          {!project.image && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
              <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              <span className="text-indigo-300 text-sm font-medium">صورة المشروع {project.id}</span>
            </div>
          )}
        </div>

        {/* Video Layer */}
        {project.video && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
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
        
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-80' : 'opacity-60'}`}
        />

        {/* Project Logo - Top Corner */}
        <div className={`absolute top-5 ${isRTL ? 'left-5 md:left-7' : 'right-5 md:right-7'} md:top-7 z-10`}>
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-xl p-2.5 border border-white/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.logo || '/logos/muhit-logo-white.png'} alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Glassmorphism Content Card */}
        <div className={`absolute bottom-5 ${isRTL ? 'right-5 md:right-8' : 'left-5 md:left-8'} md:bottom-8 z-10 w-[75%] md:w-[65%] lg:w-[55%]`}>
          <motion.div 
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
            
            {/* Content wrapper */}
            <div className="relative z-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1 text-[10px] md:text-xs font-medium rounded-full transition-colors duration-300 ${isHovered ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-white/10 text-white/70 border border-white/15'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Project Title */}
            <div className="group/link block">
              <h3 
                className={`text-lg md:text-xl lg:text-2xl font-bold mb-2 transition-colors duration-300 ${isHovered ? 'text-orange-400' : 'text-white'}`}
              >
                {project.title}
              </h3>
            </div>
            
            {/* Short Description */}
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              {project.description}
            </p>

            {/* Arrow Button */}
            <div className="flex justify-end mt-3">
              <div 
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-orange-500 scale-110' : 'bg-white/10'}`}
              >
                <ArrowUpLeft className="w-4 h-4 md:w-5 md:h-5 text-white transform rotate-90" />
              </div>
            </div>
            </div>
          </motion.div>
        </div>

        {/* Overlay Link - Makes the whole card clickable */}
        <Link 
          href={`/portfolio/${project.slug}`} 
          className="absolute inset-0 z-20"
          aria-label={project.title}
        />


      </motion.div>
    );
  }

  return (
    <section 
      data-nav-theme="light"
      className="py-16 md:py-24 px-4 md:px-6 lg:px-24 relative overflow-hidden"
      style={{
        background: '#F8F9FC',
      }}
    >

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(243, 129, 32, 0.15) 0%, transparent 70%)', willChange: 'transform', transform: 'translateZ(0)' }}
        />
        <div 
          className="absolute bottom-20 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', willChange: 'transform', transform: 'translateZ(0)' }}
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20 px-2 md:px-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: 'rgba(15, 23, 42, 0.05)',
              border: '1px solid rgba(15, 23, 42, 0.1)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-slate-600 text-sm font-medium">{t('badge')}</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-slate-800">{t('title')} </span>
            <span className="text-orange-500">
              {t('titleHighlight')}
            </span>
            <span className="text-slate-800"> {t('titleEnd')}</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
