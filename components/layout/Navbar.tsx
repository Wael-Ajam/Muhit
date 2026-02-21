"use client";

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { trackButtonClick } from '@/app/hooks/useAnalytics';


type NavTheme = 'dark' | 'light';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<NavTheme>('dark');

  // Detect section theme based on scroll position - Throttled
  const detectTheme = useCallback(() => {
    const navbarHeight = 80;
    const checkPoint = navbarHeight / 2;
    
    // Performance optimization: Don't run heavy DOM queries if we can avoid it
    // We only check theme every few frames
    requestAnimationFrame(() => {
      const sections = document.querySelectorAll('[data-nav-theme]');
      
      if (sections.length === 0) {
        // Fallback to elementFromPoint (expensive, use sparingly)
        const element = document.elementFromPoint(window.innerWidth / 2, checkPoint);
        if (element) {
          const bg = window.getComputedStyle(element).backgroundColor;
          const match = bg.match(/\d+/g);
          if (match) {
            const [r, g, b] = match.map(Number);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            setTheme(luminance > 0.5 ? 'light' : 'dark');
          }
        }
        return;
      }
  
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= checkPoint && rect.bottom >= checkPoint) {
          const sectionTheme = section.getAttribute('data-nav-theme') as NavTheme;
          if (sectionTheme) {
            setTheme(sectionTheme);
          }
          break;
        }
      }
    });
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let themeThrottleTimeout: NodeJS.Timeout | null = null;

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      
      // Only update state if crossing the threshold
      if (scrollY > 50 && lastScrollY <= 50) {
        setIsScrolled(true);
      } else if (scrollY <= 50 && lastScrollY > 50) {
        setIsScrolled(false);
      }
      
      lastScrollY = scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }

      // Throttle theme detection to run max once every 150ms
      if (!themeThrottleTimeout) {
        themeThrottleTimeout = setTimeout(() => {
          detectTheme();
          themeThrottleTimeout = null;
        }, 150);
      }
    };

    detectTheme();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectTheme, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectTheme);
      if (themeThrottleTimeout) clearTimeout(themeThrottleTimeout);
    };
  }, [detectTheme]);



  // Theme-based colors
  const isDark = theme === 'dark';
  const logoSrc = isDark ? '/logos/muhit-logo-white.png' : '/logos/muhit-logo.png';

  // Glass Effect
  const glassBackground = isScrolled
    ? isDark 
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(255, 255, 255, 0.7)'
    : 'transparent';
  
  const glassBorder = isScrolled
    ? isDark
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid rgba(0, 0, 0, 0.05)'
    : '1px solid transparent';

  const glassShadow = isScrolled
    ? isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.03)'
      : '0 4px 24px rgba(0, 0, 0, 0.08)'
    : 'none';

  const blurAmount = isScrolled ? 'blur(20px)' : 'none';



  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-9999 mx-4 sm:mx-6 lg:mx-24 mt-4 rounded-2xl transition-all duration-500"
        style={{
          background: glassBackground,
          backdropFilter: blurAmount,
          WebkitBackdropFilter: blurAmount,
          border: glassBorder,
          boxShadow: glassShadow,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center z-50">
            <Image 
              src={logoSrc}
              alt={t('logo')}
              width={100}
              height={35}
              priority
              className="h-8 w-auto transition-opacity duration-300"
            />
          </Link>



          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Book Appointment Button - Desktop */}
            <a
              href="https://calendly.com/muhitsolution-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackButtonClick('navbar-cta', undefined, 'احجز موعد - النافبار')}
              className="hidden lg:inline-flex items-center gap-2 bg-[#F27921] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#e06810] active:scale-95 transition-all"
              style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)', fontWeight: 500 }}
            >
              {t('bookAppointment')}
            </a>

            {/* Language Switcher */}
            <LanguageSwitcher theme={theme} />
          </div>
        </div>
      </motion.nav>

    </>
  );
}
