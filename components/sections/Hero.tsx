"use client";

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ModeSwitch from '@/components/ui/ModeSwitch';
import { useHomepageMode } from '@/contexts/HomepageModeContext';

const DarkVeil = dynamic(() => import('@/components/effects/DarkVeil'), { ssr: false });

type ProfileData = {
  name: string;
  role: string;
  heroHeading: { en: string; ar: string };
  bio: { en: string; ar: string };
  heroImageUrl?: string;
  resumeUrl?: string;
};

type HeroProps = {
  locale: string;
  profile?: ProfileData | null;
};

export default function Hero({ locale, profile }: HeroProps) {
  const t = useTranslations('Hero');
  const containerRef = useRef<HTMLElement>(null);
  const { mode } = useHomepageMode();
  const isCustom = mode === 'custom';
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Always use same heading — only colors and background change
  const heading = profile?.heroHeading[locale as 'en' | 'ar'] || t('heading');
  const ctaText = t('cta');

  // Split heading for gradient effect
  const headingParts = heading.split(' ');
  const firstPart = headingParts.slice(0, Math.ceil(headingParts.length / 2)).join(' ');
  const secondPart = headingParts.slice(Math.ceil(headingParts.length / 2)).join(' ');

  return (
    <section 
      ref={containerRef}
      data-nav-theme="dark"
      className="relative overflow-hidden"
      style={{
        background: isCustom ? 'transparent' : 'var(--bg-dark)',
      }}
    >
      {/* ═══════════ HERO CONTENT ═══════════ */}
      <div className="min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-24 pt-24 pb-20 relative">
        {/* Background Effect - DarkVeil only for package mode */}
        {!isCustom && (
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }}>
            <DarkVeil
              speed={0.5}
              noiseIntensity={0}
              scanlineIntensity={0}
              scanlineFrequency={0}
              warpAmount={0}
              resolutionScale={1}
            />
          </div>
        )}
        
        <motion.div
          style={{ y, opacity }}
          className="w-full px-0 md:px-4 lg:px-16 mx-auto relative z-10"
        >
          {/* Mode Switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center flex justify-center"
          >
            <ModeSwitch theme="dark" />
          </motion.div>

          {/* Mobile heading */}
          <div className="mb-8 w-full md:hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="font-bold leading-[1.2] text-center"
                style={{ fontSize: '9vw' }}
              >
                <span className="text-white block">
                  {firstPart}
                </span>
                <span className={`block mt-3 ${isCustom ? 'text-white' : 'text-orange-500'}`}>
                  {secondPart}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* ===== DESKTOP LAYOUT (md and above) ===== */}
          <div className="mb-8 w-full hidden md:block">
            <AnimatePresence mode="wait">
              <motion.h1
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="font-bold leading-tight"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 7rem)' }}
              >
                {/* First line - right aligned */}
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-white block text-right pl-4 md:pl-12 lg:pl-32 xl:pl-48"
                >
                  {firstPart}
                </motion.span>



                {/* Second line - left aligned */}
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className={`block text-left pr-4 md:pr-12 lg:pr-32 xl:pr-48 ${isCustom ? 'text-white' : 'text-orange-500'}`}
                >
                  {secondPart}
                </motion.span>
              </motion.h1>
            </AnimatePresence>
          </div>


          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex items-center justify-center"
          >
            <Link href="#pricing">
              <motion.div
                className="inline-flex items-center gap-4 group cursor-pointer"
                whileHover={{ x: -10 }}
              >
                <span className="text-lg md:text-xl text-white font-medium group-hover:text-orange-400 transition-colors">
                  {ctaText}
                </span>
                <motion.div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg shadow-orange-500/30"
                  whileHover={{ scale: 1.1, rotate: -45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Circle icon - bottom corner - only in custom mode */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute z-10 bottom-8 right-6 md:bottom-12 md:right-auto md:left-12 lg:bottom-16 lg:left-20"
        >
          <motion.img
            src="/LOGOTYPE + ICON MARK-07.svg"
            alt=""
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </section>
  );
}
