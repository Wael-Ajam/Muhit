"use client";

import { motion } from 'framer-motion';
import { 
  Award, 
  Eye, 
  Zap, 
  Handshake, 
  ArrowRight, 
  ArrowLeft, 
  MessageSquare,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import TeamSection from '@/components/sections/TeamSection';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { trackButtonClick } from '@/app/hooks/useAnalytics';

export default function AboutClient() {
  const t = useTranslations('AboutPage');
  const { direction, isRTL } = useDirection();

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ];

  const values = [
    { icon: Award, title: t('value1Title'), desc: t('value1Desc'), color: '#F97316' },
    { icon: Eye, title: t('value2Title'), desc: t('value2Desc'), color: '#8B5CF6' },
    { icon: Zap, title: t('value3Title'), desc: t('value3Desc'), color: '#06B6D4' },
    { icon: Handshake, title: t('value4Title'), desc: t('value4Desc'), color: '#10B981' },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO — Dark, Cinematic                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 50%)' }}
          />
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>



        {/* Content */}
        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {t('heroBadge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-tight mb-8"
          >
            <span className="text-white">{t('heroTitle')} </span>
            <span className="text-orange-500">{t('heroTitleHighlight')}</span>
            <br />
            <span className="text-white">{t('heroTitleEnd')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/40 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto mb-12"
          >
            {t('heroSubtitle')}
          </motion.p>


        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 2: OUR STORY — Silver, Split Layout           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="light"
        className="relative py-24 md:py-36 overflow-hidden"
        style={{ background: '#F8F9FC', direction }}
      >
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-24"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {t('storyBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-slate-800">{t('storyTitle')} </span>
              <span className="text-orange-500">{t('storyTitleHighlight')}</span>
            </h2>
          </motion.div>

          {/* Split: Story + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6 md:space-y-8"
            >
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed">{t('storyP1')}</p>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed">{t('storyP2')}</p>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed">{t('storyP3')}</p>

              {/* Accent line */}
              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative p-6 md:p-8 rounded-2xl group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-orange-500 mb-2 group-hover:scale-105 transition-transform duration-300 origin-center">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm md:text-base font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 3: VALUES — Dark, Giant Numbers                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative py-24 md:py-36 overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.04]"
            style={{ background: 'radial-gradient(ellipse, #8B5CF6, transparent 60%)' }}
          />
          <div 
            className="absolute inset-0 opacity-[0.012]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20 md:mb-28"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {t('valuesBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">{t('valuesTitle')} </span>
              <span className="text-orange-500">{t('valuesTitleHighlight')}</span>
            </h2>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, i) => {
              const ValueIcon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative p-8 md:p-10 rounded-2xl md:rounded-3xl transition-all duration-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {/* Hover border effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ border: `1px solid ${value.color}30` }}
                  />



                  {/* Icon + Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div 
                          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${value.color}, ${value.color}CC)`,
                            boxShadow: `0 10px 30px ${value.color}30`,
                          }}
                        >
                          <ValueIcon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
                        </div>
                      </motion.div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-500">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-white/40 text-base md:text-lg leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 4: CTA — Dark Gradient                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative w-full py-24 md:py-36 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a0a1f 0%, #0d0d2b 100%)', direction }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #F97316, transparent 60%)' }}
          />
        </div>

        <div className="relative z-10 text-center px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">{t('ctaTitle')} </span>
              <span className="text-orange-500">{t('ctaTitleHighlight')}</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
              {t('ctaSubtitle')}
            </p>

            <Link href="#contact" onClick={() => trackButtonClick('about-cta-contact', '/about', 'تواصل معنا - من نحن')}>
              <motion.div
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl text-white font-bold text-lg overflow-hidden cursor-pointer"
                style={{
                  background: '#F97316',
                  boxShadow: '0 15px 50px rgba(249, 115, 22, 0.3)',
                }}
                whileHover={{ scale: 1.03, boxShadow: '0 20px 60px rgba(249, 115, 22, 0.45)' }}
                whileTap={{ scale: 0.98 }}
              >


                <MessageSquare className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t('ctaButton')}</span>
                {isRTL ? (
                  <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 5: TEAM — Reuse Existing Component            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <TeamSection />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER                                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Footer />
    </>
  );
}
