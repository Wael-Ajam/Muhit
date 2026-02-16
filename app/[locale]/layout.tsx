import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import SmoothScroll from "@/components/providers/SmoothScroll";
import PageTracker from "@/components/providers/PageTracker";
import { HomepageModeProvider } from "@/contexts/HomepageModeContext";
import BottomBlurWrapper from "@/components/effects/BottomBlurWrapper";
import GlobalBackground from "@/components/GlobalBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhitsolution.com';

async function getSeoSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  const title = seo.siteTitle || 'محيط — وكالة إبداعية';
  const description = seo.siteDescription || 'وكالة إبداعية متكاملة متخصصة في التصميم والتطوير والتسويق الرقمي';
  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;
  const ogImage = seo.ogImage || '';

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: SITE_URL,
      siteName: title,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(seo.favicon ? { icons: { icon: seo.favicon } } : {}),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${ibmPlexArabic.className} ${ibmPlexArabic.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-bg-base text-text-primary min-h-screen relative overflow-x-hidden`}
      >
        <NextIntlClientProvider messages={messages}>
          <PageTracker />
          <HomepageModeProvider>
            <GlobalBackground />
            <SmoothScroll>
              <Navbar />
              <main className="relative z-10">
                {children}
              </main>
            </SmoothScroll>
            <BottomBlurWrapper />
          </HomepageModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
