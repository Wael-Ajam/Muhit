"use client";

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function ContactClient() {
  const t = useTranslations('ContactPage');
  const { direction, isRTL } = useDirection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [detectedCountry] = useState(() => {
    if (typeof window === 'undefined') return 'sa';
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = navigator.language || '';
      const region = lang.split('-')[1]?.toLowerCase();
      const tzMap: Record<string, string> = {
        'Asia/Riyadh': 'sa', 'Asia/Dubai': 'ae', 'Asia/Kuwait': 'kw',
        'Asia/Qatar': 'qa', 'Asia/Bahrain': 'bh', 'Asia/Muscat': 'om',
        'Asia/Baghdad': 'iq', 'Asia/Amman': 'jo', 'Asia/Beirut': 'lb',
        'Africa/Cairo': 'eg', 'Asia/Damascus': 'sy', 'Asia/Gaza': 'ps',
        'Asia/Aden': 'ye', 'Africa/Tripoli': 'ly', 'Africa/Khartoum': 'sd',
        'Africa/Tunis': 'tn', 'Africa/Algiers': 'dz', 'Africa/Casablanca': 'ma',
        'Europe/Istanbul': 'tr', 'America/New_York': 'us', 'America/Chicago': 'us',
        'America/Los_Angeles': 'us', 'Europe/London': 'gb', 'Europe/Berlin': 'de',
        'Europe/Paris': 'fr', 'Asia/Kolkata': 'in', 'Asia/Karachi': 'pk',
      };
      return tzMap[tz] || region || 'sa';
    } catch { return 'sa'; }
  });

  const contactInfo = [
    { icon: Mail, label: t('emailInfoLabel'), value: t('emailInfo'), href: `mailto:${t('emailInfo')}` },
    { icon: Phone, label: t('phoneInfoLabel'), value: t('phoneInfo'), href: `tel:${t('phoneInfo').replace(/\s/g, '')}` },
    { icon: MapPin, label: t('locationInfoLabel'), value: t('locationInfo'), href: '#' },
    { icon: Clock, label: t('workingHoursTitle'), value: t('workingHours'), href: '#' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      await fetch(`${apiBase}/inbox`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.error('Inbox save failed:', err);
    }

    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setPhone('');
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO — Dark, Minimal                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 50%)' }}
          />
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              {t('heroBadge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">{t('heroTitle')} </span>
            <span className="text-orange-500">{t('heroTitleHighlight')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/40 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            {t('heroSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SECTION 2: FORM + INFO — Silver Background            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="light"
        className="relative py-20 md:py-32 overflow-hidden"
        style={{ background: '#F8F9FC', direction }}
      >
        {/* Phone input library style overrides — match all other fields exactly */}
        <style>{`
          .react-international-phone-input-container {
            width: 100% !important;
            height: 56px !important;
            border-radius: 12px !important;
            border: 1px solid #e2e8f0 !important;
            background: white !important;
            transition: all 0.3s !important;
            position: relative !important;
          }
          .react-international-phone-input-container:focus-within {
            border-color: #fb923c !important;
            box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2) !important;
          }
          .react-international-phone-input-container .react-international-phone-input {
            width: 100% !important;
            height: 100% !important;
            padding: 0 20px !important;
            border: none !important;
            border-start-end-radius: 12px !important;
            border-end-end-radius: 12px !important;
            border-start-start-radius: 0 !important;
            border-end-start-radius: 0 !important;
            background: transparent !important;
            font-size: 16px !important;
            color: #1e293b !important;
            box-shadow: none !important;
            outline: none !important;
          }
          .react-international-phone-input-container .react-international-phone-input:focus {
            box-shadow: none !important;
            border: none !important;
          }
          .react-international-phone-input-container .react-international-phone-input::placeholder {
            color: #94a3b8 !important;
          }
          .react-international-phone-input-container .react-international-phone-country-selector {
            position: static !important;
          }
          .react-international-phone-input-container .react-international-phone-country-selector-button {
            height: 100% !important;
            padding: 0 14px !important;
            border: none !important;
            border-inline-end: 1px solid #e2e8f0 !important;
            border-start-start-radius: 12px !important;
            border-end-start-radius: 12px !important;
            border-start-end-radius: 0 !important;
            border-end-end-radius: 0 !important;
            background: #f8fafc !important;
            min-width: 80px !important;
            transition: background 0.3s !important;
          }
          .react-international-phone-input-container .react-international-phone-country-selector-button:hover {
            background: #f1f5f9 !important;
          }
          .react-international-phone-country-selector-dropdown {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            border-radius: 12px !important;
            border: none !important;
            outline: none !important;
            box-shadow: 0 8px 40px rgba(0,0,0,0.08) !important;
            max-height: 300px !important;
            z-index: 50 !important;
            margin-top: 4px !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          .react-international-phone-country-selector-dropdown *,
          .react-international-phone-country-selector-dropdown *::before,
          .react-international-phone-country-selector-dropdown *::after {
            border-color: transparent !important;
            outline: none !important;
          }
          .react-international-phone-country-selector-dropdown__list-item {
            padding: 10px 16px !important;
            transition: background 0.2s !important;
          }
          .react-international-phone-country-selector-dropdown__list-item:hover {
            background: #fff7ed !important;
          }
          .react-international-phone-country-selector-dropdown__list-item--selected {
            background: #fff7ed !important;
            color: #ea580c !important;
          }
        `}</style>

        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* ── FORM (3 cols) ── */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
                {t('formTitle')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      {t('nameLabel')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('namePlaceholder')}
                      className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      {t('emailLabel')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('emailPlaceholder')}
                      className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Phone + Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      {t('phoneLabel')}
                    </label>
                    <PhoneInput
                      defaultCountry={detectedCountry}
                      value={phone}
                      onChange={setPhone}
                      placeholder={t('phonePlaceholder')}
                      preferredCountries={['sa', 'ae', 'kw', 'qa', 'bh', 'om']}
                      forceDialCode
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      {t('subjectLabel')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('subjectPlaceholder')}
                      className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    {t('messageLabel')}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('messagePlaceholder')}
                    className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg cursor-pointer disabled:opacity-70"
                  style={{
                    background: '#F97316',
                    boxShadow: '0 10px 40px rgba(249, 115, 22, 0.25)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 15px 50px rgba(249, 115, 22, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? t('sending') : t('sendButton')}</span>
                  {isRTL ? (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* ── INFO CARDS (2 cols) ── */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
                {t('infoTitle')}
              </h2>

              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group flex items-center gap-5 p-5 md:p-6 rounded-2xl transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                    whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)' }}
                  >
                    <div 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                        boxShadow: '0 8px 20px rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 font-medium mb-1">{item.label}</div>
                      <div className="text-base md:text-lg font-semibold text-slate-700 group-hover:text-orange-500 transition-colors" dir="ltr">
                        {item.value}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER                                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Footer />
    </>
  );
}
