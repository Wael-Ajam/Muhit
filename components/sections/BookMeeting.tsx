"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send, User, Building2, Mail, Briefcase, FileText, Wallet, CalendarDays, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import { trackButtonClick } from '@/app/hooks/useAnalytics';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const serviceOptions = [
  'هوية بصرية',
  'إنتاج مرئي',
  'موقع إلكتروني',
  'تطبيق جوال',
  'حملة تسويقية',
  'تصميم UI/UX',
  'موشن جرافيك',
  'أخرى',
];

export default function BookMeeting() {
  const t = useTranslations('BookMeeting');
  const { direction, isRTL } = useDirection();
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    service: '',
    brief: '',
    budget: '',
    deadline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [detectedCountry, setDetectedCountry] = useState('sa');

  // Detect country: IP geolocation first, then timezone fallback
  useEffect(() => {
    const tzMap: Record<string, string> = {
      'Asia/Riyadh': 'sa', 'Asia/Dubai': 'ae', 'Asia/Kuwait': 'kw',
      'Asia/Qatar': 'qa', 'Asia/Bahrain': 'bh', 'Asia/Muscat': 'om',
      'Asia/Baghdad': 'iq', 'Asia/Amman': 'jo', 'Asia/Beirut': 'lb',
      'Africa/Cairo': 'eg', 'Asia/Damascus': 'sy', 'Asia/Gaza': 'ps',
      'Asia/Hebron': 'ps', 'Asia/Aden': 'ye', 'Africa/Tripoli': 'ly',
      'Africa/Khartoum': 'sd', 'Africa/Tunis': 'tn', 'Africa/Algiers': 'dz',
      'Africa/Casablanca': 'ma',
    };
    // Try IP geolocation first
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        if (data?.country_code) {
          setDetectedCountry(data.country_code.toLowerCase());
        }
      })
      .catch(() => {
        // Fallback to timezone detection
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          const lang = navigator.language || '';
          const region = lang.split('-')[1]?.toLowerCase();
          const detected = tzMap[tz] || region;
          if (detected) setDetectedCountry(detected);
        } catch { /* stay on 'sa' */ }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    trackButtonClick('book-meeting-form', '/', 'إرسال فورم حجز اجتماع');
    
    // 1. Send email via API
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          organization: formData.organization,
          phone,
          email: formData.email,
          service: formData.service,
          brief: formData.brief,
          budget: formData.budget,
          deadline: formData.deadline,
        }),
      });
    } catch (err) {
      console.error('Email send failed:', err);
    }

    // 2. Also open WhatsApp
    const message = `*طلب مشروع جديد*%0A%0A` +
      `*الاسم:* ${formData.name}%0A` +
      `*الجهة:* ${formData.organization}%0A` +
      `*رقم التواصل:* ${phone}%0A` +
      `*الإيميل:* ${formData.email}%0A` +
      `*الخدمة:* ${formData.service}%0A` +
      `*نبذة عن المشروع:* ${formData.brief}%0A` +
      `*الميزانية:* ${formData.budget}%0A` +
      `*تاريخ التسليم المتوقع:* ${formData.deadline}`;
    
    window.open(`https://wa.me/966559091247?text=${message}`, '_blank');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const inputClasses = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.06] transition-all duration-300";
  const labelClasses = "flex items-center gap-2 text-white/80 text-xs font-medium mb-2";

  return (
    <section
      data-nav-theme="dark"
      className="relative w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 sm:py-20 md:py-24"
    >
      {/* Dark-theme phone input overrides */}
      <style>{`
        .book-phone .react-international-phone-input-container {
          width: 100% !important;
          height: 46px !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          background: rgba(255,255,255,0.04) !important;
          transition: all 0.3s !important;
        }
        .book-phone .react-international-phone-input-container:focus-within {
          border-color: rgba(249,115,22,0.4) !important;
          background: rgba(255,255,255,0.06) !important;
        }
        .book-phone .react-international-phone-input {
          width: 100% !important;
          height: 100% !important;
          padding: 0 16px !important;
          border: none !important;
          border-start-end-radius: 12px !important;
          border-end-end-radius: 12px !important;
          border-start-start-radius: 0 !important;
          border-end-start-radius: 0 !important;
          background: transparent !important;
          font-size: 14px !important;
          color: white !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .book-phone .react-international-phone-input:focus {
          box-shadow: none !important;
          border: none !important;
        }
        .book-phone .react-international-phone-input::placeholder {
          color: rgba(255,255,255,0.25) !important;
        }
        .book-phone .react-international-phone-country-selector {
          position: static !important;
        }
        .book-phone .react-international-phone-country-selector-button {
          height: 100% !important;
          padding: 0 12px !important;
          border: none !important;
          border-inline-end: 1px solid rgba(255,255,255,0.08) !important;
          border-start-start-radius: 12px !important;
          border-end-start-radius: 12px !important;
          border-start-end-radius: 0 !important;
          border-end-end-radius: 0 !important;
          background: rgba(255,255,255,0.04) !important;
          min-width: 72px !important;
          transition: background 0.3s !important;
        }
        .book-phone .react-international-phone-country-selector-button:hover {
          background: rgba(255,255,255,0.08) !important;
        }
        .book-phone .react-international-phone-country-selector-button__dial-code {
          color: rgba(255,255,255,0.5) !important;
        }
        .book-phone .react-international-phone-country-selector-button__dropdown-arrow {
          border-top-color: rgba(255,255,255,0.3) !important;
        }
        .book-phone {
          position: relative;
        }
        .book-phone .react-international-phone-country-selector-dropdown {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: auto !important;
          width: 280px !important;
          max-width: calc(100vw - 48px) !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          outline: none !important;
          background: #1a1a2e !important;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5) !important;
          max-height: 200px !important;
          z-index: 9999 !important;
          margin-top: 4px !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
        .book-phone .react-international-phone-country-selector-dropdown *,
        .book-phone .react-international-phone-country-selector-dropdown *::before,
        .book-phone .react-international-phone-country-selector-dropdown *::after {
          border-color: transparent !important;
          outline: none !important;
        }
        .book-phone .react-international-phone-country-selector-dropdown__list-item {
          padding: 10px 14px !important;
          color: rgba(255,255,255,0.7) !important;
          transition: background 0.2s !important;
        }
        .book-phone .react-international-phone-country-selector-dropdown__list-item:hover {
          background: rgba(249,115,22,0.15) !important;
          color: white !important;
        }
        .book-phone .react-international-phone-country-selector-dropdown__list-item--selected {
          background: rgba(249,115,22,0.2) !important;
          color: #fb923c !important;
        }
        .book-phone .react-international-phone-country-selector-dropdown__list-item-dial-code {
          color: rgba(255,255,255,0.4) !important;
        }
      `}</style>

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

        {/* Right side — Smart Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="p-8 sm:p-10 md:p-14 lg:p-12 xl:p-14"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name + Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  <User className="w-3.5 h-3.5" />
                  {isRTL ? 'الاسم' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isRTL ? 'الاسم الكامل' : 'Full name'}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <Building2 className="w-3.5 h-3.5" />
                  {isRTL ? 'الجهة' : 'Organization'}
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder={isRTL ? 'اسم الشركة أو الجهة' : 'Company name'}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Row 2: Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="book-phone">
                <label className={labelClasses}>
                  <Phone className="w-3.5 h-3.5" />
                  {isRTL ? 'رقم التواصل' : 'Phone'}
                </label>
                <PhoneInput
                  key={detectedCountry}
                  defaultCountry={detectedCountry}
                  value={phone}
                  onChange={setPhone}
                  placeholder={isRTL ? 'رقم الهاتف' : 'Phone number'}
                  preferredCountries={['sa', 'ae', 'kw', 'qa', 'bh', 'om']}
                  forceDialCode
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <Mail className="w-3.5 h-3.5" />
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isRTL ? 'example@email.com' : 'example@email.com'}
                  className={inputClasses}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Row 3: Service */}
            <div>
              <label className={labelClasses}>
                <Briefcase className="w-3.5 h-3.5" />
                {isRTL ? 'الخدمة المطلوبة' : 'Required Service'}
              </label>
              <select
                name="service"
                required
                value={formData.service}
                onChange={handleChange}
                className={`${inputClasses} appearance-none cursor-pointer`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: isRTL ? '16px center' : 'calc(100% - 16px) center' }}
              >
                <option value="" disabled className="bg-[#111] text-white/50">{isRTL ? 'اختر الخدمة' : 'Select service'}</option>
                {serviceOptions.map(s => (
                  <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* Row 4: Brief */}
            <div>
              <label className={labelClasses}>
                <FileText className="w-3.5 h-3.5" />
                {isRTL ? 'نبذة عن المشروع' : 'Project Brief'}
              </label>
              <textarea
                name="brief"
                rows={3}
                value={formData.brief}
                onChange={handleChange}
                placeholder={isRTL ? 'وصف مختصر عن المشروع والأهداف المطلوبة...' : 'Brief description of the project and goals...'}
                className={`${inputClasses} resize-none`}
              />
            </div>

            {/* Row 5: Budget + Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  <Wallet className="w-3.5 h-3.5" />
                  {isRTL ? 'الميزانية المرصودة' : 'Budget'}
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder={isRTL ? 'مثال: 25,000 ريال' : 'e.g. 25,000 SAR'}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <CalendarDays className="w-3.5 h-3.5" />
                  {isRTL ? 'تاريخ التسليم المتوقع' : 'Expected Delivery'}
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`${inputClasses} [color-scheme:dark]`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-base disabled:opacity-70 transition-all duration-300"
              style={{
                background: isSubmitted
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #F97316, #EA580C)',
                boxShadow: isSubmitted
                  ? '0 12px 40px rgba(34, 197, 94, 0.3)'
                  : '0 12px 40px rgba(249, 115, 22, 0.3)',
              }}
              whileHover={!isSubmitting && !isSubmitted ? { scale: 1.02, boxShadow: '0 16px 50px rgba(249, 115, 22, 0.4)' } : {}}
              whileTap={!isSubmitting && !isSubmitted ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSubmitted ? (
                <>✓ {isRTL ? 'تم الإرسال بنجاح' : 'Sent Successfully'}</>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {isRTL ? 'أرسل طلبك' : 'Send Your Request'}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
