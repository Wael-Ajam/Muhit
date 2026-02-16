import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import PricingClient from './PricingClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingClient />;
}
