"use client";

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

type NavTheme = 'dark' | 'light';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<NavTheme>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.__lenis?.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.__lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.__lenis?.start();
    };
  }, [isMenuOpen]);

  // Theme-based colors
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white/80' : 'text-slate-700';
  const textHoverColor = isDark ? 'hover:text-white' : 'hover:text-slate-900';
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

  // Navigation links — locale-aware paths
  const navLinks = [
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/about`, label: t('about') },
    { href: 'https://calendly.com/muhitsolution-info/30min', label: t('contact'), external: true },
  ];

  // Close menu on link click
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
      }
    }
  };

  const linkContainerVariants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    },
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const linkVariants = {
    closed: {
      y: 30,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      }
    }
  };

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

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`group flex items-center gap-2.5 ${textColor} ${textHoverColor} transition-colors duration-300 text-lg font-medium`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 opacity-60 group-hover:opacity-100 group-hover:scale-150 group-hover:shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-300" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Book Appointment Button - Desktop */}
            <a
              href="https://calendly.com/muhitsolution-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 bg-[#F27921] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#e06810] active:scale-95 transition-all"
              style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)', fontWeight: 500 }}
            >
              {t('bookAppointment')}
            </a>

            {/* Language Switcher - Desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher theme={theme} />
            </div>

            {/* Hamburger Button - Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center z-50"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 8 : 0,
                    backgroundColor: isMenuOpen ? '#F97316' : isDark ? '#ffffff' : '#1E293B',
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="block w-full h-0.5 rounded-full origin-center"
                />
                <motion.span
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                    scaleX: isMenuOpen ? 0 : 1,
                    backgroundColor: isDark ? '#ffffff' : '#1E293B',
                  }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="block w-full h-0.5 rounded-full origin-center"
                />
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -8 : 0,
                    backgroundColor: isMenuOpen ? '#F97316' : isDark ? '#ffffff' : '#1E293B',
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="block w-full h-0.5 rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-9998 md:hidden overflow-hidden touch-none overscroll-none"
          >
            {/* Clean dark background */}
            <div className="absolute inset-0 bg-[#0a0a1f]/[0.97]" />

            {/* Menu Content */}
            <motion.div 
              variants={linkContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative h-full flex flex-col px-7 pt-28 pb-10 safe-area-inset"
            >
              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-center gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={linkVariants}
                    className="overflow-hidden"
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="group flex items-center gap-4 text-white/85 hover:text-white transition-colors duration-300"
                    >
                      <span className="text-[11px] text-orange-500/60 font-mono tabular-nums">
                        0{index + 1}
                      </span>
                      <span className="text-[34px] font-semibold tracking-tight">
                        {link.label}
                      </span>
                      <span className="w-0 group-hover:w-8 h-[1px] bg-orange-500 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <motion.div variants={linkVariants}>
                <div className="h-px bg-white/[0.06] mb-8" />
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={linkVariants} className="mb-8">
                <a
                  href="https://calendly.com/muhitsolution-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-[15px] font-semibold text-white transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background: '#F97316',
                    boxShadow: '0 8px 30px rgba(249, 115, 22, 0.25)',
                  }}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('bookFreeAppointment')}
                </a>
              </motion.div>

              {/* Bottom Row: Social + Language */}
              <motion.div variants={linkVariants} className="flex items-center justify-between">
                {/* Social Icons */}
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://instagram.com/muhit.agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/963991828085"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/muhit_agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/muhit-agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>

                {/* Language Switcher */}
                <LanguageSwitcher theme="dark" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
