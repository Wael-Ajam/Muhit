"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Send, Zap } from 'lucide-react';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';

export default function GetStartedSection() {
  const t = useTranslations('HowItWorks');
  const { direction } = useDirection();
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: t('step1Number'),
      icon: Sparkles,
      title: t('step1Title'),
      description: t('step1Desc'),
      gradient: "from-violet-500 to-purple-600",
      accentColor: "#8B5CF6",
    },
    {
      number: t('step2Number'),
      icon: Send,
      title: t('step2Title'),
      description: t('step2Desc'),
      gradient: "from-cyan-500 to-blue-600",
      accentColor: "#06B6D4",
    },
    {
      number: t('step3Number'),
      icon: Zap,
      title: t('step3Title'),
      description: t('step3Desc'),
      gradient: "from-emerald-500 to-teal-600",
      accentColor: "#10B981",
    },
  ];

  function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
    const x = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, 0]);

    return (
      <motion.div
        ref={ref}
        style={{ opacity, scale, x }}
        className="relative flex items-start gap-4 md:gap-8 lg:gap-12"
      >
        {/* Timeline Line & Dot */}
        <div className="flex flex-col items-center">
          {/* Dot */}
          <motion.div 
            className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${step.accentColor}, ${step.accentColor}CC)`,
              boxShadow: `0 10px 40px ${step.accentColor}40`,
            }}
            whileInView={{ scale: [0.5, 1.1, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <step.icon className="w-5 h-5 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
          </motion.div>
          
          {/* Line */}
          {index < steps.length - 1 && (
            <motion.div 
              className="w-0.5 h-24 md:h-32 lg:h-40"
              style={{
                background: `linear-gradient(180deg, ${step.accentColor}60, ${steps[index + 1].accentColor}60)`,
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          )}
        </div>

        {/* Content Card */}
        <div 
          className="flex-1 pb-12 md:pb-16 lg:pb-24"
          style={{ direction }}
        >
          {/* Step Number */}
          <motion.span 
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-2 md:mb-4 block"
            style={{ 
              color: step.accentColor,
              opacity: 0.15,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {step.number}
          </motion.span>

          <motion.h3 
            className="text-xl md:text-2xl lg:text-4xl font-bold mb-2 md:mb-4"
            style={{ color: '#1E293B' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {step.title}
          </motion.h3>

          <motion.p 
            className="text-slate-500 text-sm md:text-lg lg:text-xl max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {step.description}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <section 
      ref={containerRef}
      data-nav-theme="light"
      className="relative overflow-hidden py-16 md:py-24 lg:py-32"
      style={{
        background: '#F8F9FC',
      }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-0 w-96 h-96 rounded-full opacity-30 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #8B5CF620, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full opacity-30 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #10B98120, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Section Header - Cinematic Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24 lg:mb-32"
          style={{ direction }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-slate-800">{t('title')} </span>
            <span className="text-orange-500">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative" style={{ direction: direction === 'rtl' ? 'ltr' : 'rtl' }}>
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#pricing"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #F97316, #F59E0B)',
              boxShadow: '0 20px 50px rgba(249, 115, 22, 0.35)',
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 25px 60px rgba(249, 115, 22, 0.45)',
            }}
            whileTap={{ scale: 0.95 }}
            data-cursor-text="Start"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('cta')}</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
