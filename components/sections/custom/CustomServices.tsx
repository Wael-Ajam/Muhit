"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const services = [
  { icon: '🌐', key: 'websites' },
  { icon: '📱', key: 'apps' },
  { icon: '🎬', key: 'branding' },
  { icon: '📈', key: 'marketing' },
  { icon: '🖼️', key: 'uiux' },
  { icon: '📹', key: 'video' },
];

export default function CustomServices() {
  const t = useTranslations('CustomProject.services');

  return (
    <section
      data-nav-theme="dark"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a1f 0%, #0f0f2a 100%)' }}
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
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at center, rgba(249,115,22,0.05) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <div className="text-4xl mb-5">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t(`items.${service.key}.title`)}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {t(`items.${service.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
