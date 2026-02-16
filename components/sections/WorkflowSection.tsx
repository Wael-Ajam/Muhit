"use client";

import { motion } from 'framer-motion';
import { 
  Layers, 
  Zap,
  RefreshCcw,
  CheckCircle2,
  Infinity as InfinityIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';

export default function WorkflowSection() {
  const t = useTranslations('QueueSystem');
  const { direction } = useDirection();

  return (
    <section 
      data-nav-theme="dark"
      className="relative py-20 md:py-28 lg:py-36 overflow-hidden"
      style={{ background: '#0a0a1f' }}
    >


      <div className="relative z-10 px-4 md:px-6 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
          style={{ direction }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6">
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('title')}{' '}
            <span className="text-orange-500">{t('titleHighlight')}</span>
            {' '}{t('titleEnd')}
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ direction }}>
          
          {/* Step 1 - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 row-span-2 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group min-h-[280px] md:min-h-[340px]"
            style={{
              background: 'rgba(249, 115, 22, 0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(249, 115, 22, 0.15)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1)',
            }}
          >

            

            
            <div className="relative z-10 h-full flex flex-col">
              <div 
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #F97316, #F97316CC)',
                  boxShadow: '0 8px 30px #F9731640',
                }}
              >
                <InfinityIcon className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {t('step1Title')}
              </h3>
              <p className="text-white/50 text-sm md:text-base flex-1">
                {t('step1Desc')}
              </p>
              
              {/* Stat */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-3xl md:text-4xl font-black text-orange-500">∞</div>
                <div className="text-white/40 text-sm">{t('statRequests')}</div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 p-5 md:p-6 rounded-2xl relative overflow-hidden group min-h-[140px] md:min-h-[160px]"
            style={{
              background: 'rgba(139, 92, 246, 0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
            }}
          >

            

            
            <div className="relative z-10">
              <div 
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #8B5CF6CC)',
                  boxShadow: '0 6px 20px #8B5CF640',
                }}
              >
                <Layers className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                {t('step2Title')}
              </h3>
              <p className="text-white/50 text-xs md:text-sm line-clamp-2">
                {t('step2Desc')}
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="col-span-1 p-5 md:p-6 rounded-2xl relative overflow-hidden group min-h-[140px] md:min-h-[160px]"
            style={{
              background: 'rgba(14, 165, 233, 0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(14, 165, 233, 0.15)',
              boxShadow: '0 8px 32px rgba(14, 165, 233, 0.1)',
            }}
          >

            

            
            <div className="relative z-10">
              <div 
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9, #0EA5E9CC)',
                  boxShadow: '0 6px 20px #0EA5E940',
                }}
              >
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                {t('step3Title')}
              </h3>
              <p className="text-white/50 text-xs md:text-sm line-clamp-2">
                {t('step3Desc')}
              </p>
            </div>
          </motion.div>

          {/* Step 4 - Wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-2 p-5 md:p-6 rounded-2xl relative overflow-hidden group"
            style={{
              background: 'rgba(16, 185, 129, 0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)',
            }}
          >

            

            
            <div className="relative z-10 flex items-start gap-4">
              <div 
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #10B981CC)',
                  boxShadow: '0 6px 20px #10B98140',
                }}
              >
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-white mb-1">
                  {t('step4Title')}
                </h3>
                <p className="text-white/50 text-xs md:text-sm">
                  {t('step4Desc')}
                </p>
              </div>
              
              {/* Delivery stat */}
              <div className="text-left shrink-0">
                <div className="text-2xl md:text-3xl font-black text-emerald-500">24h</div>
                <div className="text-white/40 text-xs">{t('statDelivery')}</div>
              </div>
            </div>
          </motion.div>

          {/* Info Card - Revisions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="col-span-2 p-5 md:p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'rgba(139, 92, 246, 0.04)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(139, 92, 246, 0.12)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.08)',
            }}
          >

            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                <RefreshCcw className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-white mb-1">
                  {t('revisionsTitle')}
                </h3>
                <p className="text-white/50 text-xs md:text-sm">
                  {t('revisionsDesc')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info Card - Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-2 p-5 md:p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'rgba(249, 115, 22, 0.04)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(249, 115, 22, 0.12)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.08)',
            }}
          >

            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-white mb-1">
                  {t('descCardTitle')}
                </h3>
                <p className="text-white/50 text-xs md:text-sm">
                  {t('descCardText')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
