import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import PortfolioSection from "@/components/sections/PortfolioSection";
import Footer from "@/components/layout/Footer";
import { 
  LazySpecializationsSection,
  LazyFAQSection,
  LazyPricingSection,
  LazyGetStartedSection,
  LazyWorksGridSection,
  LazyBookMeeting,
  LazyCustomFAQSection
} from "@/components/LazyComponents";
import { setRequestLocale } from 'next-intl/server';
import HomepageContent from "@/components/HomepageContent";
import Showreel from "@/components/sections/Showreel";
import ValueStackSection from "@/components/sections/ValueStackSection";
import BigStatement from "@/components/sections/BigStatement";
import { fetchProjects, fetchSettings } from "@/lib/api";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch projects and settings from API
  const [projects, settings] = await Promise.all([
    fetchProjects(),
    fetchSettings(),
  ]);

  const showreelDesktop = settings.showreelDesktop || '';
  const showreelMobile = settings.showreelMobile || '';

  const packageContent = (
    <>
      {/* المرحلة 2: الاهتمام — Interest */}
      <Features showreelDesktop={showreelDesktop} showreelMobile={showreelMobile} />
      <LazySpecializationsSection />
      
      {/* المرحلة 3: الرغبة — Desire (Social Proof) */}
      <PortfolioSection projects={projects} locale={locale} />
      
      {/* المرحلة 4: الجسر — Bridge to Action */}
      <LazyGetStartedSection />
      
      {/* المرحلة 5: القرار — Decision */}
      <LazyPricingSection />
      <LazyFAQSection />
    </>
  );

  const customContent = (
    <>
      <Showreel showreelDesktop={showreelDesktop} showreelMobile={showreelMobile} />
      <ValueStackSection />
      <BigStatement />
      <LazySpecializationsSection minimal />
      <LazyWorksGridSection projects={projects} locale={locale} />
      <LazyBookMeeting />
      <LazyCustomFAQSection />
    </>
  );

  return (
    <>
      {/* المرحلة 1: الجذب — Hero always visible with mode switch */}
      <div className="relative z-10">
        <Hero locale={locale} />
      </div>

      {/* Conditional content based on mode */}
      <HomepageContent
        packageContent={packageContent}
        customContent={customContent}
      />

      {/* المرحلة 6: الإغلاق — Close */}
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
