"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function CustomHero() {
  const t = useTranslations('CustomProject.hero');

  return (
    <section
      data-nav-theme="dark"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a1f 0%, #1a0a2e 50%, #0a0a1f 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 60%)' }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 px-4 md:px-6 lg:px-24 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.2)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">{t('badge')}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          {t('title')}
          <span className="text-orange-500 block mt-2">{t('titleHighlight')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#custom-contact"
            className="px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #f59e0b 100%)',
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.3)',
            }}
          >
            {t('cta')}
          </a>
          <a
            href="#custom-process"
            className="px-8 py-4 rounded-2xl text-white/70 hover:text-white font-medium text-lg transition-all duration-300"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {t('ctaSecondary')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
