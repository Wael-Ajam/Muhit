"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown,
  ArrowUpCircle,
  Layers,
  UserCheck,
  Zap,
  RefreshCcw,
  Shield
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import { trackButtonClick } from '@/app/hooks/useAnalytics';

export default function FAQSection() {
  const t = useTranslations('FAQ');
  const { direction, isRTL, textAlign } = useDirection();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('q1'),
      answer: t('a1'),
      icon: ArrowUpCircle,
    },
    {
      question: t('q2'),
      answer: t('a2'),
      icon: Layers,
    },
    {
      question: t('q3'),
      answer: t('a3'),
      icon: UserCheck,
    },
    {
      question: t('q4'),
      answer: t('a4'),
      icon: Zap,
    },
    {
      question: t('q5'),
      answer: t('a5'),
      icon: RefreshCcw,
    },
    {
      question: t('q6'),
      answer: t('a6'),
      icon: Shield,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq"
      data-nav-theme="light"
      className="relative py-20 md:py-28 lg:py-36 overflow-hidden"
      style={{
        background: '#F8F9FC',
      }}
    >


      <div className="relative z-10 px-4 md:px-6 lg:px-24" style={{ direction }}>
        {/* Section Header - Cinematic Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm mb-8">
            <HelpCircle className="w-4 h-4" />
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-slate-800">{t('title')} </span>
            <span className="text-orange-500">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="mb-3 md:mb-4"
            >
              <div
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  openIndex === index 
                    ? 'bg-white shadow-lg shadow-slate-200/50' 
                    : 'bg-white/60 hover:bg-white hover:shadow-md'
                }`}
                style={{
                  border: openIndex === index 
                    ? '1px solid rgba(249, 115, 22, 0.2)' 
                    : '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center gap-4 p-5 md:p-6 ${textAlign}`}
                >
                  {/* Icon */}
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-[#F97316] shadow-lg shadow-orange-500/30' 
                        : 'bg-slate-100'
                    }`}
                  >
                    <faq.icon 
                      className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                        openIndex === index ? 'text-white' : 'text-slate-500'
                      }`} 
                      strokeWidth={1.5} 
                    />
                  </div>

                  {/* Question Text */}
                  <span 
                    className={`flex-1 text-base md:text-lg font-semibold transition-colors duration-300 ${
                      openIndex === index ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Chevron */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-orange-100 rotate-180' 
                        : 'bg-slate-100'
                    }`}
                  >
                    <ChevronDown 
                      className={`w-5 h-5 transition-colors duration-300 ${
                        openIndex === index ? 'text-orange-500' : 'text-slate-400'
                      }`} 
                    />
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pr-18 md:pr-22">
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-slate-500 mb-4">{t('bottomQuestion')}</p>
          <a 
            href="https://wa.me/966559091247"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackButtonClick('faq-cta', '/', 'تواصل معنا - الأسئلة')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{
              background: '#25D366',
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
            }}
          >
            {t('contactUs')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
