"use client";

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Infinity as InfinityIcon, 
  Palette, 
  UserCheck, 
  Lightbulb,
  Building2,
  MessageSquare,
  Check,
  ArrowLeft,
  ArrowRight,
  Zap,
  Crown,
  Shield,
  Users,
  Headphones,
  FileText,
  Lock,
  CalendarCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';

export default function PricingSection() {
  const t = useTranslations('Pricing');
  const { direction, isRTL, textAlign } = useDirection();

  const mainFeatures = [
    { icon: InfinityIcon, text: t('feature1') },
    { icon: InfinityIcon, text: t('feature2') },
    { icon: Palette, text: t('feature3') },
    { icon: UserCheck, text: t('feature4') },
    { icon: Lightbulb, text: t('feature5') },
    { icon: Building2, text: t('feature6') },
  ];

  const enterpriseFeatures = [
    { icon: Zap, text: t('ent1') },
    { icon: Users, text: t('ent2') },
    { icon: Crown, text: t('ent3') },
    { icon: Shield, text: t('ent4') },
    { icon: Headphones, text: t('ent5') },
    { icon: FileText, text: t('ent6') },
    { icon: Lock, text: t('ent7') },
    { icon: CalendarCheck, text: t('ent8') },
  ];

  return (
    <section 
      id="pricing"
      data-nav-theme="dark"
      className="relative overflow-hidden py-20 md:py-32 lg:py-40"
      style={{ background: '#0a0a1f' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Centered radial glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 50%)' }}
        />

        {/* Top fade line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      </div>

      <div className="relative z-10 px-4 md:px-6 lg:px-24 max-w-7xl mx-auto">
        
        {/* ═══════════ SECTION HEADER ═══════════ */}
        <div
          className="text-center mb-16 md:mb-24"
          style={{ direction }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight mb-5">
            <span className="text-white">{t('title')} </span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
            <br />
            <span className="text-white">{t('titleEnd')}</span>
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* ═══════════ MAIN PRICING CARD ═══════════ */}
        <div
          className="relative mb-6 md:mb-8"
        >
          {/* Animated Gradient Border */}
          <div className="absolute -inset-[1px] rounded-2xl md:rounded-3xl overflow-hidden">
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
            style={{
              background: 'linear-gradient(135deg, rgba(16, 16, 45, 0.95) 0%, rgba(10, 10, 35, 0.98) 100%)',
            }}
          >
            {/* Inner glow at top */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06]"
              style={{ background: 'radial-gradient(ellipse, #F97316, transparent 70%)' }}
            />
            
            <div className="relative z-10 p-8 md:p-14 lg:p-16" style={{ direction }}>
              {/* Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
                
                {/* ── LEFT: Price & CTA ── */}
                <div className={`lg:w-[45%] flex flex-col ${isRTL ? 'lg:pl-14 lg:border-l' : 'lg:pr-14 lg:border-r'} lg:border-white/[0.06]`}>
                  
                  {/* Badge */}
                  <div
                    className="mb-8"
                  >
                    <span 
                      className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs md:text-sm font-semibold overflow-hidden"
                      style={{ background: '#F97316' }}
                    >
                      {/* Shimmer */}
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
                      <span className="relative z-10">{t('mostComprehensive')}</span>
                    </span>
                  </div>

                  {/* Plan Name */}
                  <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 ${textAlign}`}>
                    {t('planName')}
                  </h3>

                  {/* Capacity line */}
                  <p className={`text-white/40 text-sm md:text-base mb-8 md:mb-10 ${textAlign}`}>
                    {t('capacity')} <span className="text-orange-400 font-bold">{t('capacityHighlight')}</span> {t('capacityEnd')}
                  </p>

                  {/* Price — dramatic reveal */}
                  <div 
                    className={`mb-8 md:mb-10 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <span className={`text-sm md:text-base text-white/40 font-medium mb-2 block ${textAlign}`}>{t('startsFrom')}</span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent tracking-tight">
                        {t('price')}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-lg md:text-xl text-orange-400 font-bold">{t('currency')}</span>
                        <span className="text-sm text-white/30">{t('perMonth')}</span>
                      </div>
                    </div>
                    {/* Underline accent */}
                    <div className="mt-3 h-[2px] w-24 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />
                  </div>

                  {/* CTA Button */}
                  <motion.a
                    href="#contact"
                    className={`group relative inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-xl text-white font-bold text-base md:text-lg overflow-hidden transition-all duration-300 w-full justify-center`}
                    style={{
                      background: '#F97316',
                      boxShadow: '0 15px 50px rgba(249, 115, 22, 0.3)',
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: '0 20px 60px rgba(249, 115, 22, 0.45)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    data-cursor-text="GO"
                  >
                    {/* Hover shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <MessageSquare className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{t('cta')}</span>
                    {isRTL ? (
                      <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    )}
                  </motion.a>

                  {/* Trial text */}
                  <p className={`text-white/25 text-xs md:text-sm mt-5 ${textAlign}`}>
                    {t('trial')}
                  </p>
                </div>

                {/* ── RIGHT: Features ── */}
                <div className={`lg:w-[55%] ${isRTL ? 'lg:pr-14' : 'lg:pl-14'}`}>
                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
                    {mainFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="group relative flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center shrink-0 group-hover:from-orange-500/30 group-hover:to-orange-600/20 transition-all duration-300">
                          <feature.icon className="w-4.5 h-4.5 text-orange-400" strokeWidth={1.5} />
                        </div>
                        {/* Text */}
                        <span className="text-white/70 text-sm md:text-base font-medium group-hover:text-white/90 transition-colors duration-300">
                          {feature.text}
                        </span>
                        {/* Hover line */}
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-0' : 'left-0'} w-[3px] h-0 group-hover:h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full transition-all duration-300`} />
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

                  {/* Enterprise Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 flex items-center justify-center">
                        <Crown className="w-4 h-4 text-violet-400" />
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-white/80">
                        {t('enterpriseTitle')}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-3">
                      {enterpriseFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2.5 group"
                        >
                          <div className="w-5 h-5 rounded-full bg-orange-500/15 group-hover:bg-orange-500/30 flex items-center justify-center shrink-0 transition-colors duration-300">
                            <Check className="w-3 h-3 text-orange-400" strokeWidth={2.5} />
                          </div>
                          <span className="text-white/45 group-hover:text-white/70 text-xs md:text-sm leading-tight transition-colors duration-300">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ BOTTOM TRUST STRIP ═══════════ */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4"
        >
          <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <Shield className="w-5 h-5 text-orange-400/70" />
            <span className="text-white/50 text-sm md:text-base font-medium">{isRTL ? 'بدون التزام طويل' : 'No Long-term Commitment'}</span>
          </span>
          <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <Zap className="w-5 h-5 text-orange-400/70" />
            <span className="text-white/50 text-sm md:text-base font-medium">{isRTL ? 'تفعيل فوري' : 'Instant Activation'}</span>
          </span>
          <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <Lock className="w-5 h-5 text-orange-400/70" />
            <span className="text-white/50 text-sm md:text-base font-medium">{isRTL ? 'إلغاء بأي وقت' : 'Cancel Anytime'}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
