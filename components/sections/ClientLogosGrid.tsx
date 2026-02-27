"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useHomepageMode } from '@/contexts/HomepageModeContext';

const coloredLogos = [
  // ── مؤسسات حكومية سعودية ──
  { name: 'وزارة الصحة', src: '/logos/colored/وزارة الصحة.png' },
  { name: 'وزارة الحج', src: '/logos/colored/وزارو الحج.png' },
  { name: 'هيئة التراث', src: '/logos/colored/هيئة التراث.png' },
  { name: 'إمارة المنطقة', src: '/logos/colored/امارة المنطقة.png' },
  { name: 'المواصفات', src: '/logos/colored/المواصفات.png' },
  { name: 'King Faisal', src: '/logos/colored/King Faisal.png' },
  // ── مؤسسات سعودية كبرى ──
  { name: 'البنوك السعودية', src: '/logos/colored/البنوك السعودية.png' },
  { name: 'مجلس المؤسسة', src: '/logos/colored/مجلس المؤسسة.png' },
  { name: 'جسارة', src: '/logos/colored/جسارة.png' },
  // ── منظمات دولية وإعلام ──
  { name: 'UNICEF', src: '/logos/colored/unicef.png' },
  { name: 'الجزيرة', src: '/logos/colored/الجزيرة.png' },
  { name: 'Total', src: '/logos/colored/Total.png' },
  { name: 'المخبر الاقتصادي', src: '/logos/colored/المخبر الاقتصادي.png' },
  // ── شركات ومؤسسات أخرى ──
  { name: 'Hadia', src: '/logos/colored/Hadia.png' },
  { name: 'المجدوعي', src: '/logos/colored/المجدوعي.png' },
  { name: 'السبيعي', src: '/logos/colored/السبيعي.png' },
  { name: 'نقي', src: '/logos/colored/نقي.png' },
  { name: 'ركن الحوار', src: '/logos/colored/ركن الحوار.png' },
];

export default function ClientLogosGrid() {
  const t = useTranslations('ClientLogos');
  const { mode } = useHomepageMode();
  const isCustom = mode === 'custom';

  return (
    <section
      data-nav-theme="dark"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: isCustom ? 'transparent' : '#0a0a1f' }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            <span className="text-white">{t('title')} </span>
            <span className="text-orange-500">{t('titleHighlight')}</span>
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto font-medium">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
          {coloredLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="group relative flex items-center justify-center rounded-2xl p-5 md:p-6 transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className={`relative z-10 w-full object-contain transition-transform duration-300 group-hover:scale-110 ${isCustom ? 'h-28 md:h-32' : 'h-20 md:h-24'}`}
                loading="lazy"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
