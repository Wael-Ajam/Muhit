"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  theme?: 'dark' | 'light';
};

export default function LanguageSwitcher({ theme = 'dark' }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleLocale}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
        isDark ? 'text-white' : 'text-slate-700'
      }`}
      style={{ 
        background: isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.05)', 
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.2)' 
          : '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Globe size={18} />
      <span>{locale === 'en' ? t('ar') : t('en')}</span>
    </motion.button>
  );
}
