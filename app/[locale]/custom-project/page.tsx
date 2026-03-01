import Hero from "@/components/sections/Hero";
import LogoSlider from "@/components/sections/LogoSlider";
import Footer from "@/components/layout/Footer";
import {
  LazyWorksGridSection,
  LazyBookMeeting,
  LazyClientLogosGrid,
} from "@/components/LazyComponents";
import { setRequestLocale } from "next-intl/server";
import Showreel from "@/components/sections/Showreel";
import ValueStackSection from "@/components/sections/ValueStackSection";
import BigStatement from "@/components/sections/BigStatement";
import ServicesGridSection from "@/components/sections/custom/ServicesGridSection";
import { fetchProjects, fetchSettings } from "@/lib/api";
import CustomProjectClient from "./CustomProjectClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CustomProjectPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [projects, settings] = await Promise.all([
    fetchProjects(),
    fetchSettings(),
  ]);

  const showreelDesktop = settings.showreelDesktop || "";
  const showreelMobile = settings.showreelMobile || "";
  const showreelDesktopPoster = settings.showreelDesktopPoster || "";
  const showreelMobilePoster = settings.showreelMobilePoster || "";

  return (
    <>
      <CustomProjectClient />

      <div className="relative z-10">
        <Hero locale={locale} hideSwitch />
        <LogoSlider />
      </div>

      <div className="relative z-10">
        <Showreel
          showreelDesktop={showreelDesktop}
          showreelMobile={showreelMobile}
          showreelDesktopPoster={showreelDesktopPoster}
          showreelMobilePoster={showreelMobilePoster}
        />
        <ValueStackSection />
        <BigStatement />
        <ServicesGridSection />
        <LazyWorksGridSection projects={projects} locale={locale} />
        <LazyClientLogosGrid />
        <LazyBookMeeting />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
