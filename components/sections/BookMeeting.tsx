"use client";

import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight, Clock, Users, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';

export default function BookMeeting() {
  const t = useTranslations('BookMeeting');
  const { direction, isRTL } = useDirection();

  const highlights = [
    {
      icon: Clock,
      text: t('highlight1'),
    },
    {
      icon: Users,
      text: t('highlight2'),
    },
    {
      icon: MessageCircle,
      text: t('highlight3'),
    },
  ];

  return (
    <section
      data-nav-theme="dark"
      className="relative w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 sm:py-20 md:py-24"
    >
      <div
        className="w-full grid grid-cols-1 lg:grid-cols-2 border border-white/[0.07] rounded-2xl md:rounded-3xl overflow-hidden"
        style={{ direction }}
      >
        {/* Left side — Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center p-8 sm:p-10 md:p-14 lg:p-16 xl:p-20 border-b lg:border-b-0 lg:border-e border-white/[0.07]"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs sm:text-sm w-fit mb-6 md:mb-8">
            <Calendar className="w-3.5 h-3.5" />
            {t('badge')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] text-white mb-4 md:mb-6">
            {t('title')}
            <br />
            <span className="text-orange-500">{t('titleHighlight')}</span>
          </h2>

          <p className="text-white/50 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Right side — Highlights & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col justify-center p-8 sm:p-10 md:p-14 lg:p-16 xl:p-20"
        >
          {/* Highlights */}
          <div className="space-y-5 sm:space-y-6 mb-10 md:mb-12">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F2F2F3]/10 border border-[#F2F2F3]/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#F2F2F3]" strokeWidth={1.5} />
                </div>
                <span className="text-white/80 text-base sm:text-lg font-medium">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-white font-semibold text-base sm:text-lg cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #F97316, #EA580C)',
                boxShadow: '0 12px 40px rgba(249, 115, 22, 0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 16px 50px rgba(249, 115, 22, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-5 h-5" />
              {t('cta')}
              <ArrowUpRight className={`w-5 h-5 ${isRTL ? 'rotate-270' : ''}`} />
            </motion.div>
          </a>
          <p className="text-white/40 text-sm mt-4">{t('ctaNote')}</p>
        </motion.div>
      </div>
    </section>
  );
}
