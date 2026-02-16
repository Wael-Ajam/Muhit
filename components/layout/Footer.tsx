"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  ArrowUpRight, 
  Mail, 
  MapPin, 
  Phone,
  Instagram,
  Linkedin,
  Facebook,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import { useHomepageMode } from '@/contexts/HomepageModeContext';
import { trackButtonClick } from '@/app/hooks/useAnalytics';

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Pinterest icon
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
);

export default function Footer({ hideCTA = false }: { hideCTA?: boolean }) {
  const t = useTranslations('Footer');
  const { direction, isRTL } = useDirection();
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const { mode } = useHomepageMode();
  const isCustom = mode === 'custom';
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const currentYear = new Date().getFullYear();

  const locale = useLocale();

  const navLinks = [
    { label: t('nav.work'), href: `/${locale}/portfolio` },
    { label: t('nav.pricing'), href: `/${locale}/pricing` },
    { label: t('nav.about'), href: `/${locale}/about` },
    { label: t('nav.contact'), href: 'https://calendly.com/muhitsolution-info/30min', external: true },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: XIcon, href: 'https://x.com', label: 'X' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: PinterestIcon, href: 'https://pinterest.com', label: 'Pinterest' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ direction, background: isCustom ? 'transparent' : '#0a0a1f' }}
    >


      {/* Main Content */}
      <div className="relative z-10">
        
        {!hideCTA && (
        <motion.div 
          style={{ y, opacity }}
          className="border-b border-white/5"
        >
          <div className="px-6 md:px-12 lg:px-24 py-20 md:py-32">
            <div className="max-w-7xl mx-auto">
              {/* Big headline */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
                  {t('cta.title')}
                  <br />
                  <span className="text-orange-500">
                    {t('cta.titleHighlight')}
                  </span>
                </h2>
                <p className="text-white/40 text-lg md:text-xl max-w-xl">
                  {t('cta.subtitle')}
                </p>
              </motion.div>

              {/* CTA Button with magnetic effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a href="https://calendly.com/muhitsolution-info/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackButtonClick('footer-cta', undefined, 'تواصل معنا - الفوتر')}>
                  <motion.div
                    className="inline-flex items-center gap-4 group cursor-pointer"
                    whileHover={{ x: isRTL ? -10 : 10 }}
                  >
                    <span className="text-lg md:text-xl text-white font-medium group-hover:text-orange-400 transition-colors">
                      {t('cta.button')}
                    </span>
                    <motion.div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F97316] flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: -45 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </motion.div>
                  </motion.div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Newsletter & Info Section */}
        <div className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-b border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('newsletter.title')}
              </h3>
              <p className="text-white/40 mb-8 max-w-md">
                {t('newsletter.subtitle')}
              </p>
              
              {/* Email input */}
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <button 
                  className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 bg-[#F97316] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity`}
                  onClick={() => trackButtonClick('footer-newsletter', undefined, 'اشتراك النشرة')}
                >
                  {t('newsletter.button')}
                </button>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-white/40 text-sm block">{t('contact.email')}</span>
                  <a href="mailto:hello@muhit.sa" className="text-white hover:text-orange-400 transition-colors">
                    hello@muhit.sa
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-white/40 text-sm block">{t('contact.phone')}</span>
                  <a href="tel:+966500000000" className="text-white hover:text-orange-400 transition-colors" dir="ltr">
                    +966 50 000 0000
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-white/40 text-sm block">{t('contact.location')}</span>
                  <span className="text-white">{t('contact.address')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation & Social Links */}
        <div className="px-6 md:px-12 lg:px-24 py-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Link 
                    href={link.href}
                    className="relative text-white/60 hover:text-white transition-colors text-sm md:text-base"
                  >
                    {link.label}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-px bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredLink === link.label ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500/20 transition-colors group"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <social.icon className="w-5 h-5 text-white/60 group-hover:text-orange-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 md:px-12 lg:px-24 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo & Copyright */}
            <div className="flex items-center gap-6">
              <Link href="/">
                <Image
                  src="/logos/muhit-logo-white.png"
                  alt="Muhit"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <span className="text-white/30 text-sm">
                © {currentYear} {t('copyright')}
              </span>
            </div>

            {/* Scroll to top */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
              whileHover={{ y: -3 }}
            >
              <span className="text-sm">{t('backToTop')}</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <ChevronUp className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </div>

      </div>
    </footer>
  );
}
