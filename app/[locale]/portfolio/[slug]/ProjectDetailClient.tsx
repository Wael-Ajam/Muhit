"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ApiProject, localize } from '@/lib/types';

import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import '@/components/ui/ScrollReveal.css';
import { trackButtonClick } from '@/app/hooks/useAnalytics';

export default function ProjectDetailClient({ project: apiProject, locale }: { project: ApiProject; locale: string }) {
  const t = useTranslations('ProjectDetail');
  const { isRTL, direction } = useDirection();

  // Hide GradientBlobs
  useEffect(() => {
    const blobs = document.querySelector('.fixed.inset-0.z-0') as HTMLElement;
    const bottomBlur = document.querySelector('.gradual-blur-page')?.closest('div') as HTMLElement;
    if (blobs) blobs.style.display = 'none';
    if (bottomBlur) bottomBlur.style.display = 'none';
    return () => {
      if (blobs) blobs.style.display = '';
      if (bottomBlur) bottomBlur.style.display = '';
    };
  }, []);

  const title = localize(apiProject, 'title', locale);
  const description = localize(apiProject, 'desc', locale);
  const categoryLabels = apiProject.categories.map(c => {
    if (c.category) {
      return locale === 'ar' ? c.category.nameAr : c.category.nameEn;
    }
    return c.categorySlug;
  });
  const tags = apiProject.tags.map(tag => t(tag.tagKey));
  const project = {
    ...apiProject,
    image: apiProject.coverImage,
    video: apiProject.coverVideo,
  };
  const slug = apiProject.slug;

  // Helper to render media (image or video) with placeholder fallback
  const renderMedia = (src: string, type: string, alt: string, priority = false) => {
    if (!src) {
      const isVideo = type === 'video';
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{
          background: isVideo
            ? 'linear-gradient(135deg, #1a1e2e 0%, #0d1b2a 100%)'
            : 'linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)',
        }}>
          <div className="opacity-40 flex flex-col items-center gap-3">
            {isVideo ? (
              <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
            ) : (
              <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            )}
            <span className={`text-sm font-medium ${isVideo ? 'text-amber-300' : 'text-indigo-300'}`}>{alt}</span>
          </div>
        </div>
      );
    }
    return type === 'image' ? (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    ) : (
      <video
        className="w-full h-full object-cover"
        src={src}
        muted
        loop
        playsInline
        autoPlay
        poster={project.image || undefined}
        onError={(e) => {
          (e.target as HTMLVideoElement).style.display = 'none';
        }}
      />
    );
  };

  const gallery = apiProject.gallery;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO — Title + Description + Tags                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative pt-36 md:pt-44 overflow-hidden"
        style={{ background: '#0a0a1f' }}
      >
        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24" style={{ direction }}>
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium text-white/60 hover:text-white transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {isRTL ? (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              )}
              {t('backToPortfolio')}
            </Link>
          </motion.div>

          {/* Project Title — Big & Bold */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.95] tracking-tight mb-8"
          >
            {title}
          </motion.h1>

          {/* Client Website Link */}
          {project.websiteUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mb-6"
            >
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-orange-400 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                {project.websiteUrl.replace('https://', '')}
              </a>
            </motion.div>
          )}

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/45 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl mb-6"
          >
            {description}
          </motion.p>

          {/* Categories + Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-12 md:mb-16"
          >
            {categoryLabels.map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-orange-300"
                style={{
                  background: 'rgba(249, 115, 22, 0.12)',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                {label}
              </span>
            ))}
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase text-white/40"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SMART GALLERY — Dynamic Layout Engine                     */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {(() => {
          // Helper: determine effective layout for legacy items
          const effectiveLayout = (item: typeof gallery[0]) => {
            const l = item.layout;
            if (l === 'landscape' || l === 'portrait' || l === 'square') return l;
            // Legacy mappings
            if (l === 'full') return 'landscape';
            if (l === 'half') return 'portrait';
            if (l === 'tall') return 'portrait';
            return 'landscape';
          };

          // Group gallery items into display rows
          type RowGroup = { type: 'full'; items: typeof gallery } | { type: 'pair'; items: typeof gallery } | { type: 'triple'; items: typeof gallery };
          const groups: RowGroup[] = [];
          const remaining = [...gallery];

          // First item always full-width hero
          if (remaining.length > 0) {
            groups.push({ type: 'full', items: [remaining.shift()!] });
          }

          // Group the rest smartly
          while (remaining.length > 0) {
            const item = remaining[0];
            const layout = effectiveLayout(item);

            if (layout === 'landscape' || item.type === 'video') {
              // Landscape & videos → full width
              groups.push({ type: 'full', items: [remaining.shift()!] });
            } else if (layout === 'portrait') {
              // Portrait → pair of 2
              const pair = [remaining.shift()!];
              if (remaining.length > 0 && effectiveLayout(remaining[0]) === 'portrait') {
                pair.push(remaining.shift()!);
              }
              groups.push({ type: pair.length === 2 ? 'pair' : 'full', items: pair });
            } else {
              // Square → try to group 2-3
              const batch = [remaining.shift()!];
              while (batch.length < 3 && remaining.length > 0 && effectiveLayout(remaining[0]) === 'square') {
                batch.push(remaining.shift()!);
              }
              if (batch.length === 1) {
                groups.push({ type: 'full', items: batch });
              } else {
                groups.push({ type: batch.length === 3 ? 'triple' : 'pair', items: batch });
              }
            }
          }

          // Story paragraphs to interleave
          const storyTexts = [
            localize(apiProject, 'longDesc', locale),
            localize(apiProject, 'storyP2', locale),
            localize(apiProject, 'storyP3', locale),
          ].filter(Boolean);

          let storyIndex = 0;
          const elements: React.ReactNode[] = [];

          groups.forEach((group, gi) => {
            // After the hero (first group) and then every 2 groups, insert a story paragraph
            if (gi === 1 && storyTexts[storyIndex]) {
              elements.push(
                <div key={`story-${storyIndex}`} className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24 flex justify-end" style={{ direction }}>
                  <div className="max-w-3xl">
                    <ScrollReveal
                      baseOpacity={0.1}
                      enableBlur={true}
                      baseRotation={2}
                      blurStrength={3}
                      textClassName="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed font-light"
                    >
                      {storyTexts[storyIndex]}
                    </ScrollReveal>
                  </div>
                </div>
              );
              storyIndex++;
            } else if (gi > 1 && gi % 2 === 0 && storyIndex < storyTexts.length) {
              elements.push(
                <div key={`story-${storyIndex}`} className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24 flex ${storyIndex % 2 === 0 ? 'justify-end' : 'justify-start'}`} style={{ direction }}>
                  <div className="max-w-3xl">
                    <ScrollReveal
                      baseOpacity={0.1}
                      enableBlur={true}
                      baseRotation={2}
                      blurStrength={3}
                      textClassName="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed font-light"
                    >
                      {storyTexts[storyIndex]}
                    </ScrollReveal>
                  </div>
                </div>
              );
              storyIndex++;
            }

            // ── Render the group ──
            if (group.type === 'full') {
              const item = group.items[0];
              const isHero = gi === 0;
              const isPortrait = effectiveLayout(item) === 'portrait';
              const isPortraitVideo = isPortrait && item.type === 'video';
              elements.push(
                <motion.div
                  key={`g-${gi}`}
                  initial={{ opacity: 0, y: isHero ? 60 : 50 }}
                  {...(isHero ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-100px' } })}
                  transition={{ delay: isHero ? 0.5 : 0, duration: isHero ? 0.8 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`relative w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 ${isPortrait && !isHero ? 'flex justify-center' : ''}`}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl md:rounded-3xl"
                    style={{
                      aspectRatio: isPortraitVideo ? '9/16' : isPortrait ? '3/4' : '16/9',
                      maxHeight: isHero ? '85vh' : isPortrait ? undefined : '75vh',
                      ...(isPortrait && !isHero ? { width: '100%', maxWidth: '500px' } : {}),
                    }}
                  >
                    {renderMedia(item.src, item.type, `${title} - ${gi + 1}`, isHero)}
                  </div>
                </motion.div>
              );
            } else if (group.type === 'pair') {
              elements.push(
                <div key={`g-${gi}`} className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
                  <div className="grid grid-cols-2 gap-3 md:gap-6">
                    {group.items.map((item, ii) => (
                      <motion.div
                        key={ii}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, delay: ii * 0.15 }}
                      >
                        <div
                          className="relative overflow-hidden rounded-xl md:rounded-3xl"
                          style={{
                            aspectRatio: effectiveLayout(item) === 'portrait' ? '3/4' : '4/5',
                            maxHeight: '60vh',
                          }}
                        >
                          {renderMedia(item.src, item.type, `${title} - ${gi + 1}-${ii + 1}`)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            } else if (group.type === 'triple') {
              elements.push(
                <div key={`g-${gi}`} className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                    {group.items.map((item, ii) => (
                      <motion.div
                        key={ii}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: ii * 0.12 }}
                        className={group.items.length === 3 && ii === 2 ? 'col-span-2 sm:col-span-1' : ''}
                      >
                        <div
                          className="relative overflow-hidden rounded-xl md:rounded-3xl"
                          style={{
                            aspectRatio: '4/5',
                            maxHeight: '50vh',
                          }}
                        >
                          {renderMedia(item.src, item.type, `${title} - ${gi + 1}-${ii + 1}`)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            }
          });

          // Add remaining story paragraphs at the end
          while (storyIndex < storyTexts.length) {
            elements.push(
              <div key={`story-${storyIndex}`} className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24 flex ${storyIndex % 2 === 0 ? 'justify-end' : 'justify-start'}`} style={{ direction }}>
                <div className="max-w-3xl">
                  <ScrollReveal
                    baseOpacity={0.1}
                    enableBlur={true}
                    baseRotation={2}
                    blurStrength={3}
                    textClassName="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed font-light"
                  >
                    {storyTexts[storyIndex]}
                  </ScrollReveal>
                </div>
              </div>
            );
            storyIndex++;
          }

          return <div className="flex flex-col gap-6 md:gap-10 pb-20 md:pb-28">{elements}</div>;
        })()}

      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PROJECT NAVIGATION — Back to Portfolio                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative py-20 md:py-32 overflow-hidden"
        style={{ background: '#0a0a1f' }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center justify-center">
            <Link href="/portfolio" className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 px-8 py-4 rounded-full text-white/60 hover:text-white transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {isRTL ? (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                )}
                <span className="text-sm font-medium">{t('backToPortfolio')}</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CTA — Dark Cinematic                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        data-nav-theme="dark"
        className="relative py-28 md:py-40 overflow-hidden"
        style={{ background: '#0a0a1f', direction }}
      >

        <div className="relative z-10 text-center px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {t('ctaTitle')}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">{t('ctaTitle')} </span>
              <span className="text-orange-500">{t('ctaTitleHighlight')}</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
              {t('ctaSubtitle')}
            </p>

            <Link href="https://calendly.com/muhitsolution-info/30min" target="_blank" rel="noopener noreferrer" onClick={() => trackButtonClick('project-cta-contact', `/portfolio/${slug}`, 'تواصل معنا - تفاصيل المشروع')}>
              <motion.div
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl text-white font-bold text-lg overflow-hidden cursor-pointer"
                style={{
                  background: '#F97316',
                  boxShadow: '0 15px 50px rgba(249, 115, 22, 0.3)',
                }}
                whileHover={{ scale: 1.03, boxShadow: '0 20px 60px rgba(249, 115, 22, 0.45)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t('ctaButton')}</span>
                {isRTL ? (
                  <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer hideCTA />
    </>
  );
}
