"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Infinity as InfinityIcon, 
  Palette, 
  UserCheck, 
  Lightbulb,
  ClipboardCheck,
  MessageSquare,
  Check,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Crown,
  Shield,
  Headphones,
  FileText,
  Lock,
  CalendarCheck,
  ChevronDown,
  DollarSign,
  UsersRound,
  Gauge,
  X,
} from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { trackButtonClick } from '@/app/hooks/useAnalytics';

const DarkVeil = dynamic(() => import('@/components/effects/DarkVeil'), { ssr: false });

export default function PricingClient() {
  const t = useTranslations('PricingPage');
  const { direction, isRTL, textAlign } = useDirection();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const howRef = useRef<HTMLElement>(null);

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ];

  const comparisons = [
    { 
      icon: DollarSign, 
      title: t('compare1Title'), 
      traditional: t('compare1Traditional'), 
      subscription: t('compare1Subscription') 
    },
    { 
      icon: UsersRound, 
      title: t('compare2Title'), 
      traditional: t('compare2Traditional'), 
      subscription: t('compare2Subscription') 
    },
    { 
      icon: Gauge, 
      title: t('compare3Title'), 
      traditional: t('compare3Traditional'), 
      subscription: t('compare3Subscription') 
    },
  ];

  const mainFeatures = [
    { icon: UsersRound, text: t('feature1') },
    { icon: Lightbulb, text: t('feature2') },
    { icon: ClipboardCheck, text: t('feature3') },
    { icon: InfinityIcon, text: t('feature4') },
    { icon: FileText, text: t('feature5') },
    { icon: Headphones, text: t('feature6') },
  ];

  const enterpriseFeatures = [
    { icon: CalendarCheck, text: t('ent1') },
    { icon: FileText, text: t('ent2') },
    { icon: UserCheck, text: t('ent3') },
    { icon: Palette, text: t('ent4') },
    { icon: Shield, text: t('ent5') },
    { icon: Crown, text: t('ent6') },
    { icon: Lock, text: t('ent7') },
    { icon: Headphones, text: t('ent8') },
  ];

  const steps = [
    { number: t('howStep1Number'), title: t('howStep1Title'), desc: t('howStep1Desc') },
    { number: t('howStep2Number'), title: t('howStep2Title'), desc: t('howStep2Desc') },
    { number: t('howStep3Number'), title: t('howStep3Title'), desc: t('howStep3Desc') },
  ];

  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
    { q: t('faqQ5'), a: t('faqA5') },
    { q: t('faqQ6'), a: t('faqA6') },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO — Dark, Full-Screen, Price Reveal      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >
        {/* Background Effects */}
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <span 
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(249, 115, 22, 0.15)',
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
            className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-6"
          >
            <span className="text-white">{t('heroTitle')}</span>
            <br />
            <span className="text-[#F97316]">{t('heroTitleHighlight')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Price Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="mb-10"
          >
            <span className="text-sm md:text-base text-white/40 font-medium block mb-3">{t('startsFrom')}</span>
            <div className="flex items-baseline gap-3 justify-center">
              <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight">
                {t('price')}
              </span>
              <div className="flex flex-col items-start">
                <span className="text-xl md:text-2xl text-[#F97316] font-bold">{t('currency')}</span>
                <span className="text-sm text-white/30">{t('perMonth')}</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <Link href="#contact" onClick={() => trackButtonClick('pricing-hero-cta', '/pricing', 'احجز اجتماع - هيرو الباقات')}>
              <motion.div
                className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-white font-bold text-lg overflow-hidden cursor-pointer"
                style={{
                  background: '#F97316',
                  boxShadow: '0 15px 50px rgba(249, 115, 22, 0.3)',
                }}
                whileHover={{ scale: 1.03, boxShadow: '0 20px 60px rgba(249, 115, 22, 0.45)' }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t('heroCta')}</span>
                {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </motion.div>
            </Link>
            <span className="text-white/30 text-sm">{t('trialBadge')}</span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 2: SOCIAL PROOF STRIP — Light                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="light"
        className="relative py-16 md:py-20"
        style={{ background: '#F8F9FC', direction }}
      >
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F97316] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 3: WHY SUBSCRIBE — Light, Comparison           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="light"
        className="relative py-20 md:py-32"
        style={{ background: '#F8F9FC', direction }}
      >
        <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {t('whyBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-5">
              <span className="text-gray-900">{t('whyTitle')}</span>{' '}
              <span className="text-[#F97316]">{t('whyTitleHighlight')}</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              {t('whySubtitle')}
            </p>
          </motion.div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {comparisons.map((item, i) => {
              const isHighlighted = i === 1;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden ${isHighlighted ? 'md:scale-105 md:-my-4' : ''}`}
                style={{ 
                  background: isHighlighted ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' : '#ffffff',
                  border: isHighlighted ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isHighlighted 
                    ? '0 25px 60px rgba(249, 115, 22, 0.3), 0 10px 20px rgba(249, 115, 22, 0.15)' 
                    : '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                <div className="p-8 md:p-10">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: isHighlighted ? 'rgba(255,255,255,0.2)' : '#FFF7ED' }}
                  >
                    <item.icon className={`w-6 h-6 ${isHighlighted ? 'text-white' : 'text-[#F97316]'}`} />
                  </div>
                  
                  <h3 className={`text-xl md:text-2xl font-bold mb-6 ${isHighlighted ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  
                  {/* Traditional */}
                  <div 
                    className="mb-5 pb-5"
                    style={{ borderBottom: isHighlighted ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: isHighlighted ? 'rgba(255,255,255,0.15)' : '#FEE2E2' }}
                      >
                        <X className={`w-3 h-3 ${isHighlighted ? 'text-white/60' : 'text-red-400'}`} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isHighlighted ? 'text-white/50' : 'text-red-400'}`}>{t('compareTraditional')}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isHighlighted ? 'text-white/50' : 'text-gray-400'}`}>{item.traditional}</p>
                  </div>
                  
                  {/* Subscription */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: isHighlighted ? 'rgba(255,255,255,0.25)' : '#DCFCE7' }}
                      >
                        <Check className={`w-3 h-3 ${isHighlighted ? 'text-white' : 'text-emerald-500'}`} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isHighlighted ? 'text-white/90' : 'text-emerald-500'}`}>{t('compareSubscription')}</span>
                    </div>
                    <p className={`text-sm font-semibold leading-relaxed ${isHighlighted ? 'text-white' : 'text-gray-800'}`}>{item.subscription}</p>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 4: PRICING CARD — Dark                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative py-20 md:py-32 overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 50%)' }}
          />
        </div>

        <div className="relative z-10 px-4 md:px-6 lg:px-24 max-w-7xl mx-auto">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mb-8"
          >
            {/* Gradient Border */}
            <div className="absolute -inset-px rounded-2xl md:rounded-3xl overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.08) 25%, rgba(139,92,246,0.15) 50%, rgba(249,115,22,0.08) 75%, rgba(249,115,22,0.3) 100%)',
                }}
              />
            </div>
            
            {/* Card Content */}
            <div 
              className="relative rounded-2xl md:rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(16, 16, 45, 0.95) 0%, rgba(10, 10, 35, 0.98) 100%)' }}
            >
              {/* Glow */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06]"
                style={{ background: 'radial-gradient(ellipse, #F97316, transparent 70%)' }}
              />
              
              <div className="relative z-10 p-8 md:p-14 lg:p-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
                  
                  {/* LEFT: Project Request & CTA */}
                  <div className={`lg:w-[45%] flex flex-col ${isRTL ? 'lg:pl-14 lg:border-l' : 'lg:pr-14 lg:border-r'} lg:border-white/[0.06]`}>
                    
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="mb-8"
                    >
                      <span 
                        className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs md:text-sm font-semibold overflow-hidden"
                        style={{ background: '#F97316' }}
                      >
                        <span 
                          className="absolute inset-0" 
                          style={{
                            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                            animation: 'shimmer 4s linear infinite',
                          }}
                        />
                        <style jsx>{`
                          @keyframes shimmer {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(100%); }
                          }
                        `}</style>
                        <Sparkles className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">{t('planBadge')}</span>
                      </span>
                    </motion.div>

                    {/* Plan Name */}
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 ${textAlign}`}>
                      {t('planName')}
                    </h3>

                    {/* Description */}
                    <p className={`text-white/50 text-sm md:text-base leading-relaxed mb-8 md:mb-10 ${textAlign}`}>
                      {t('planDesc')}
                    </p>

                    {/* Decorative line */}
                    <div className="mb-8 md:mb-10">
                      <div className="h-[2px] w-24 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />
                    </div>

                    {/* CTA Button */}
                    <motion.a
                      href="#contact"
                      onClick={() => trackButtonClick('pricing-plan-cta', '/pricing', 'ابدأ الآن - كرت الباقة')}
                      className="group relative inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-xl text-white font-bold text-base md:text-lg overflow-hidden transition-all duration-300 w-full justify-center"
                      style={{
                        background: '#F97316',
                        boxShadow: '0 15px 50px rgba(249, 115, 22, 0.3)',
                      }}
                      whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(249, 115, 22, 0.45)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <MessageSquare className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{t('planCta')}</span>
                      {isRTL ? (
                        <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      )}
                    </motion.a>

                    <p className={`text-white/25 text-xs md:text-sm mt-5 ${textAlign}`}>
                      {t('planTrial')}
                    </p>
                  </div>

                  {/* RIGHT: Features */}
                  <div className={`lg:w-[55%] ${isRTL ? 'lg:pr-14' : 'lg:pl-14'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
                      {mainFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
                          className="group relative flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
                          style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center shrink-0 group-hover:from-orange-500/30 group-hover:to-orange-600/20 transition-all duration-300">
                            <feature.icon className="w-4.5 h-4.5 text-orange-400" strokeWidth={1.5} />
                          </div>
                          <span className="text-white/70 text-sm md:text-base font-medium group-hover:text-white/90 transition-colors duration-300">
                            {feature.text}
                          </span>
                          <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-0' : 'left-0'} w-[3px] h-0 group-hover:h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full transition-all duration-300`} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

                    {/* Enterprise */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-violet-400" />
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-white/80">
                          {t('enterpriseTitle')}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {enterpriseFeatures.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.04 }}
                            className="flex items-center gap-2.5 group"
                          >
                            <div className="w-5 h-5 rounded-full bg-orange-500/15 group-hover:bg-orange-500/30 flex items-center justify-center shrink-0 transition-colors duration-300">
                              <Check className="w-3 h-3 text-orange-400" strokeWidth={2.5} />
                            </div>
                            <span className="text-white/45 group-hover:text-white/70 text-xs md:text-sm leading-tight transition-colors duration-300">
                              {feature.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4"
          >
            <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <Shield className="w-5 h-5 text-orange-400/70" />
              <span className="text-white/50 text-sm md:text-base font-medium">{t('trustNoBind')}</span>
            </span>
            <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <Zap className="w-5 h-5 text-orange-400/70" />
              <span className="text-white/50 text-sm md:text-base font-medium">{t('trustInstant')}</span>
            </span>
            <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <Lock className="w-5 h-5 text-orange-400/70" />
              <span className="text-white/50 text-sm md:text-base font-medium">{t('trustCancel')}</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 5: HOW IT WORKS — Light, Silver Steps           */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        ref={howRef}
        data-nav-theme="light"
        className="relative py-24 md:py-36 overflow-hidden"
        style={{ background: '#F8F9FC', direction }}
      >
        {/* Subtle Background Pattern */}
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
            className="text-center mb-20 md:mb-28"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              {t('howBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-slate-800">{t('howTitle')}</span>{' '}
              <span className="text-orange-500">{t('howTitleHighlight')}</span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="space-y-6 md:space-y-0">
            {(() => {
              const stepIcons = [Sparkles, MessageSquare, Check];
              return steps.map((step, i) => {
                const StepIcon = stepIcons[i];
                const isEven = i % 2 === 0;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="group"
                  >
                    <div className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 py-10 md:py-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                      
                      {/* Number side */}
                      <div className="relative flex-shrink-0 flex items-center justify-center w-full md:w-[280px]">
                        {/* Giant watermark number */}
                        <span 
                          className="text-[120px] md:text-[200px] font-black leading-none select-none"
                          style={{
                            color: 'transparent',
                            WebkitTextStroke: '2px rgba(249, 115, 22, 0.25)',
                          }}
                        >
                          0{step.number}
                        </span>
                      </div>

                      {/* Content side */}
                      <div className={`flex-1 text-center ${isEven ? `md:${isRTL ? 'text-right' : 'text-left'}` : `md:${isRTL ? 'text-left' : 'text-right'}`}`}>
                        <div className={`flex items-center gap-4 mb-4 justify-center ${isEven ? `md:${isRTL ? 'justify-end' : 'justify-start'}` : `md:${isRTL ? 'justify-start' : 'justify-end'}`}`}>
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <div 
                              className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                              style={{
                                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                                boxShadow: '0 8px 30px rgba(249, 115, 22, 0.3)',
                              }}
                            >
                              <StepIcon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
                            </div>
                          </motion.div>
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors duration-500">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed group-hover:text-slate-700 transition-colors duration-500">
                          {step.desc}
                        </p>
                        {/* Accent line on hover */}
                        <div className={`mt-6 w-16 h-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-24 mx-auto ${isEven ? 'md:mx-0' : `md:${isRTL ? 'mr-0 ml-auto' : 'ml-auto mr-0'}`}`} />
                      </div>
                    </div>

                    {/* Separator */}
                    {i < steps.length - 1 && (
                      <div className="relative h-px mx-auto max-w-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-orange-100 border border-orange-200" />
                      </div>
                    )}
                  </motion.div>
                );
              });
            })()}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 6: FAQ — Dark, Accordion                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative py-20 md:py-32 overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[180px] opacity-10"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
          />
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 md:mb-20"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {t('faqBadge')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              <span className="text-white">{t('faqTitle')} </span>
              <span className="text-[#F97316]">{t('faqTitleHighlight')}</span>
            </h2>
            <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto">
              {t('faqSubtitle')}
            </p>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-start"
                >
                  <div
                    className={`rounded-2xl transition-all duration-300 ${
                      openFaq === i 
                        ? 'bg-white/[0.06] border border-orange-500/20' 
                        : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between p-5 md:p-6">
                      <span className={`text-sm md:text-base font-medium transition-colors ${
                        openFaq === i ? 'text-orange-400' : 'text-white/80'
                      }`}>
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 ml-4"
                      >
                        <ChevronDown className={`w-5 h-5 transition-colors ${
                          openFaq === i ? 'text-orange-400' : 'text-white/40'
                        }`} />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-5 md:pb-6">
                            <div className="h-px bg-white/[0.06] mb-4" />
                            <p className="text-white/50 text-sm md:text-base leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Bottom question */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-white/40 text-sm mb-4">{t('faqBottomQuestion')}</p>
            <Link href="#contact" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors" onClick={() => trackButtonClick('pricing-faq-contact', '/pricing', 'تواصل معنا - الأسئلة')}>
              {t('faqContactUs')}
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 7: CTA — White, Final Push                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="light"
        className="relative py-24 md:py-36 overflow-hidden"
        style={{ background: '#ffffff', direction }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              {t('ctaTitle')}
              <br />
              <span className="text-[#F97316]">{t('ctaTitleHighlight')}</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              {t('ctaSubtitle')}
            </p>
            <Link href="#contact" onClick={() => trackButtonClick('pricing-final-cta', '/pricing', 'تواصل معنا - CTA نهائي')}>
              <motion.div
                className="inline-flex items-center gap-4 group cursor-pointer"
                whileHover={{ x: isRTL ? -10 : 10 }}
              >
                <span className="text-lg md:text-xl text-gray-900 font-medium group-hover:text-[#F97316] transition-colors">
                  {t('ctaButton')}
                </span>
                <motion.div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F97316] flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: -45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
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
