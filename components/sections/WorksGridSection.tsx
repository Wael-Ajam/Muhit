"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';

export default function WorksGridSection() {
  const t = useTranslations('Portfolio');
  const { isRTL } = useDirection();
  const titleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: titleRef,
    offset: ["start end", "end start"]
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  const projects = [
    {
      id: 1,
      slug: "integrated-ad-campaign",
      image: "",
      titleKey: 'project1Title' as const,
      tags: ['تصميم', 'تسويق'],
    },
    {
      id: 2,
      slug: "full-brand-identity",
      image: "",
      titleKey: 'project2Title' as const,
      tags: ['هوية بصرية', 'تصميم'],
    },
    {
      id: 3,
      slug: "motion-promo-video",
      image: "",
      titleKey: 'project3Title' as const,
      tags: ['موشن', 'تسويق'],
    },
    {
      id: 4,
      slug: "advanced-ecommerce-store",
      image: "",
      titleKey: 'project4Title' as const,
      tags: ['تطوير', 'تصميم'],
    },
    {
      id: 5,
      slug: "mobile-app",
      image: "",
      titleKey: 'project5Title' as const,
      tags: ['تطوير', 'UI/UX'],
    },
    {
      id: 6,
      slug: "social-media-campaign",
      image: "",
      titleKey: 'project6Title' as const,
      tags: ['تسويق', 'تصميم'],
    },
  ];

  function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative rounded-2xl md:rounded-3xl overflow-hidden"
        style={{ height: 'clamp(650px, 85vh, 1150px)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-80' : 'opacity-60'}`}
        />

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
                {project.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className={`px-3 py-1 text-[10px] md:text-xs font-medium rounded-full transition-colors duration-300 ${isHovered ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-white/10 text-white/70 border border-white/15'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Project Title */}
              <Link 
                href={`/portfolio/${project.slug}`}
                className="group/link block cursor-pointer"
              >
                <h3 
                  className={`text-lg md:text-xl lg:text-2xl font-bold mb-2 transition-colors duration-300 ${isHovered ? 'text-orange-400' : 'text-white'}`}
                >
                  {t(project.titleKey)}
                </h3>
              </Link>

              {/* Short Description */}
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                {t(`project${project.id}Desc`)}
              </p>
              <div className="flex justify-end mt-3">
                <Link 
                  href={`/portfolio/${project.slug}`}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-orange-500 scale-110' : 'bg-white/10'}`}
                >
                  <ArrowUpLeft className="w-4 h-4 md:w-5 md:h-5 text-white transform rotate-90" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <section
      data-nav-theme="dark"
      className="pt-16 md:pt-24 relative overflow-hidden"
    >
      <div className="relative z-10">
        {/* Stretched Title */}
        <motion.div
          ref={titleRef}
          style={{ scale: titleScale, y: titleY, opacity: titleOpacity }}
          className="mb-10 md:mb-16 px-4 md:px-6 lg:px-16"
        >
          {/* Mobile */}
          <h2
            className="md:hidden text-white font-bold text-center w-full"
            style={{
              fontSize: 'clamp(2.5rem, 11vw, 4rem)',
              lineHeight: 1,
            }}
          >
            أعـــــــــــــمـــــــــــــالــــــــــــنـــــــــــــا
          </h2>
          {/* Desktop */}
          <h2
            className="hidden md:block text-white font-bold text-center w-full"
            style={{
              fontSize: 'clamp(4rem, 12vw, 12rem)',
              lineHeight: 1,
            }}
          >
            أعـــــــــــــــمـــــــــــــــالــــــــــــــنـــــــــــــــا
          </h2>
        </motion.div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 px-4 md:px-6 lg:px-24">
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
