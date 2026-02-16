"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const steps = [
  { icon: '💬', key: 'discovery' },
  { icon: '🎨', key: 'design' },
  { icon: '⚙️', key: 'development' },
  { icon: '🚀', key: 'launch' },
];

export default function CustomProcess() {
  const t = useTranslations('CustomProject.process');

  return (
    <section
      id="custom-process"
      data-nav-theme="dark"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: '#0a0a1f' }}
    >
      <div className="relative z-10 px-4 md:px-6 lg:px-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-4"
          >
            {t('label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white"
          >
            {t('title')}
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative p-6 rounded-2xl group"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 text-[60px] font-black text-white/[0.03] leading-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {t(`steps.${step.key}.description`)}
              </p>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-orange-500/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
