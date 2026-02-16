"use client";

import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Clock, 
  Sparkles,
  ArrowRight,
  Shuffle,
  Timer,
  Brain,
  Workflow,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';

export default function ExperienceSection() {
  const t = useTranslations('BackendKitchen');
  const { direction, arrowRotation, isRTL } = useDirection();

  const transformations = [
    { before: t('chaos'), after: t('clearSystem'), beforeIcon: Shuffle, afterIcon: Workflow },
    { before: t('delay'), after: t('regularDelivery'), beforeIcon: Timer, afterIcon: Clock },
    { before: t('indecision'), after: t('decisiveDecisions'), beforeIcon: TrendingDown, afterIcon: Brain },
  ];

  return (
    <section 
      data-nav-theme="light"
      className="relative py-20 md:py-28 lg:py-36 overflow-hidden"
      style={{
        background: '#F8F9FC',
      }}
    >


      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 px-4 md:px-6 lg:px-24" style={{ direction }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm mb-6">
            <ChefHat className="w-4 h-4" />
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-orange-500">
              {t('titleHighlight')}
            </span>
            <span className="text-slate-800"> {t('titleEnd')}</span>
          </h2>
        </motion.div>

        {/* Main Content - Bento Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          
          {/* Years Card - Large (Left Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:row-span-3 relative p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              boxShadow: '0 20px 60px rgba(249, 115, 22, 0.25)',
            }}
          >

            
            {/* Large Number Background */}
            <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} -bottom-8 text-[180px] md:text-[220px] font-black text-white/10 leading-none select-none`}>
              {t('yearsNumber')}
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[280px] md:min-h-[360px]">
              <div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <ChefHat className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
                </div>
                
                <div className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-2">
                  {t('yearsNumber')}+
                </div>
                <div className="text-xl md:text-2xl font-bold text-white/90 mb-2">
                  {t('yearsTitle')}
                </div>
                <div className="text-white/70 text-sm md:text-base">
                  {t('yearsSubtitle')}
                </div>
              </div>
              
              {/* Bottom Note */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/20 mt-6">
                <Sparkles className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm">{t('bottomNote')}</span>
              </div>
            </div>
          </motion.div>

          {/* Transformation Cards */}
          {transformations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group"
            >
              <div 
                className="h-full p-5 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >

                
                <div className="relative z-10">
                  {/* Before → After Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                        <item.beforeIcon className="w-4 h-4 text-red-500" strokeWidth={2} />
                      </div>
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                      <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-orange-500 ${arrowRotation} transition-colors duration-300`} />
                    </div>
                    
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <item.afterIcon className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">{t('from')}</div>
                      <div className="text-base md:text-lg font-semibold text-red-500 line-through decoration-red-300/50">
                        {item.before}
                      </div>
                    </div>
                    
                    <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                      <div className="text-xs text-slate-400 mb-0.5">{t('to')}</div>
                      <div className="text-base md:text-lg font-bold text-emerald-600">
                        {item.after}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card - Full Width Below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 md:mt-8 max-w-5xl mx-auto"
        >
            <div 
              className="p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    {t('descMain')} <span className="text-orange-400 font-semibold">{t('chaos')}</span>، <span className="text-orange-400 font-semibold">{t('delay')}</span>، {t('and')}<span className="text-orange-400 font-semibold">{t('indecision')}</span> {t('descEnd')}
                  </p>
                </div>
                
                <motion.a 
                  href="#pricing"
                  className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                    boxShadow: '0 12px 30px rgba(249, 115, 22, 0.35)',
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 16px 40px rgba(249, 115, 22, 0.45)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor-text="ابدأ"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('cta')}</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
}
