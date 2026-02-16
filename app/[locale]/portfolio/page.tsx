import { setRequestLocale } from 'next-intl/server';
import { fetchProjects } from '@/lib/api';
import PortfolioClient from './PortfolioClient';

type Props = {
  params: Promise<{ locale: string }>;
};

// Allow dynamic rendering (projects come from API)
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await fetchProjects();

  return <PortfolioClient projects={projects} locale={locale} />;
}
