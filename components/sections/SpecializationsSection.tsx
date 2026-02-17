"use client";

import { motion } from 'framer-motion';
import { 
  Brain,
  Pen,
  Palette,
  Film,
  Box,
  Code,
  Settings,
  Bot,
  Camera,
  Mic,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

type Category = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  gradient: string;
  accentColor: string;
  specs: string[];
  extraCost?: boolean;
};

export default function SpecializationsSection({ minimal = false }: { minimal?: boolean }) {
  const t = useTranslations('Specializations');
  const { direction } = useDirection();

  const allCategories: Category[] = [
    {
      icon: Brain,
      title: t('cat1Title'),
      gradient: "from-violet-500 to-purple-600",
      accentColor: "#8B5CF6",
      specs: [t('cat1Spec1'), t('cat1Spec2'), t('cat1Spec3'), t('cat1Spec4'), t('cat1Spec5')],
    },
    {
      icon: Pen,
      title: t('cat2Title'),
      gradient: "from-blue-500 to-indigo-600",
      accentColor: "#3B82F6",
      specs: [t('cat2Spec1'), t('cat2Spec2'), t('cat2Spec3')],
    },
    {
      icon: Palette,
      title: t('cat3Title'),
      gradient: "from-pink-500 to-rose-600",
      accentColor: "#EC4899",
      specs: [t('cat3Spec1'), t('cat3Spec2'), t('cat3Spec3'), t('cat3Spec4'), t('cat3Spec5')],
    },
    {
      icon: Film,
      title: t('cat4Title'),
      gradient: "from-orange-500 to-red-600",
      accentColor: "#F97316",
      specs: [t('cat4Spec1'), t('cat4Spec2'), t('cat4Spec3'), t('cat4Spec4'), t('cat4Spec5')],
    },
    {
      icon: Box,
      title: t('cat5Title'),
      gradient: "from-cyan-500 to-teal-600",
      accentColor: "#06B6D4",
      specs: [t('cat5Spec1'), t('cat5Spec2')],
    },
    {
      icon: Code,
      title: t('cat6Title'),
      gradient: "from-emerald-500 to-green-600",
      accentColor: "#10B981",
      specs: [t('cat6Spec1'), t('cat6Spec2'), t('cat6Spec3'), t('cat6Spec4'), t('cat6Spec5'), t('cat6Spec6'), t('cat6Spec7')],
    },
    {
      icon: Settings,
      title: t('cat7Title'),
      gradient: "from-slate-500 to-gray-600",
      accentColor: "#64748B",
      specs: [t('cat7Spec1'), t('cat7Spec2')],
    },
    {
      icon: Bot,
      title: t('cat8Title'),
      gradient: "from-fuchsia-500 to-purple-600",
      accentColor: "#D946EF",
      specs: [t('cat8Spec1')],
    },
    {
      icon: Camera,
      title: t('add1Title'),
      gradient: "from-amber-500 to-yellow-600",
      accentColor: "#F59E0B",
      specs: [t('add1Spec1'), t('add1Spec2'), t('add1Spec3')],
      extraCost: true,
    },
    {
      icon: Mic,
      title: t('add2Title'),
      gradient: "from-red-500 to-pink-600",
      accentColor: "#EF4444",
      specs: [t('add2Spec1'), t('add2Spec2')],
      extraCost: true,
    },
  ];

  return (
    <section 
      data-nav-theme="dark"
      className="relative"
      style={{
        background: minimal ? 'transparent' : '#0a0a1f',
      }}
    >
      {/* Background Decorations */}
      {!minimal && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 60%)' }}
          />
        </div>
      )}

      {/* Section Header — outside ScrollStack */}
      {!minimal && (
        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pt-16 sm:pt-20 md:pt-28 lg:pt-32 xl:pt-40" style={{ direction }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-6 md:mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {t('badge')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-white">{t('title')} </span>
              <span className="text-orange-500">
                {t('titleHighlight')}
              </span>
              <span className="text-white"> {t('titleEnd')}</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      )}

      {/* ScrollStack */}
      <div className={`relative z-10 ${minimal ? 'px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto' : 'px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24'}`} style={{ direction }}>
        <div className={minimal ? 'max-w-[1000px]' : ''}>
        <ScrollStack
          useWindowScroll
          itemDistance={80}
          itemScale={0.02}
          itemStackDistance={40}
          stackPosition="15%"
          scaleEndPosition="5%"
          baseScale={0.88}
          blurAmount={1}
          onStackComplete={() => {}}
        >
          {allCategories.map((category, index) => (
            <ScrollStackItem 
              key={index}
              itemClassName="spec-stack-card"
            >
              <div 
                className={`w-full h-full rounded-[40px] border border-white/[0.08] p-6 sm:p-8 md:p-10 flex ${minimal ? 'flex-col gap-4' : 'flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-8'}`}
                style={{
                  background: '#12122e',
                  boxShadow: `0 0 40px ${category.accentColor}10`,
                }}
              >
                {/* Accent glow */}
                <div 
                  className="absolute inset-0 rounded-[40px] opacity-[0.06] pointer-events-none"
                  style={{ 
                    background: `radial-gradient(ellipse at 20% 50%, ${category.accentColor}, transparent 60%)` 
                  }}
                />

                {/* Icon + Title */}
                <div className="relative z-10 flex items-center gap-4 shrink-0">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${category.gradient} shadow-lg shrink-0`}
                    style={{
                      boxShadow: `0 8px 24px ${category.accentColor}30`,
                    }}
                  >
                    <category.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl ${minimal ? 'font-medium' : 'font-bold'} text-white leading-tight`}>
                      {category.title}
                    </h3>
                    {category.extraCost && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold"
                        style={{
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          color: '#FBBF24',
                          boxShadow: '0 0 12px rgba(245, 158, 11, 0.1)',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {t('additionalBadge')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs as pills */}
                <div className="relative z-10 flex flex-wrap gap-2 sm:justify-end">
                  {category.specs.map((spec, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[11px] md:text-xs text-white/70 bg-white/[0.05] border border-white/[0.08]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
        </div>
      </div>
    </section>
  );
}
