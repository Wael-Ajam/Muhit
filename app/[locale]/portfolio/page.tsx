import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import PortfolioClient from './PortfolioClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortfolioClient />;
}
