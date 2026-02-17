"use client";

import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ui/ScrollReveal';
import '@/components/ui/ScrollReveal.css';
import { useHomepageMode } from '@/contexts/HomepageModeContext';

export default function BigStatement() {
  const t = useTranslations('BigStatement');
  const { mode } = useHomepageMode();
  const isCustom = mode === 'custom';

  return (
    <section className="relative w-full pt-20 sm:pt-28 md:pt-36 lg:pt-44 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">



        <ScrollReveal
          baseOpacity={0.1}
          enableBlur={true}
          baseRotation={2}
          blurStrength={3}
          textClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.3] sm:leading-[1.25]"
          containerClassName="text-[#F2F2F3]"
        >
          {isCustom ? t('line1Custom') : t('line1')}
        </ScrollReveal>
      </div>
    </section>
  );
}
