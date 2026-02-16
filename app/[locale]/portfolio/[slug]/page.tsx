import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fetchProjectBySlug, fetchProjects } from '@/lib/api';
import ProjectDetailClient from './ProjectDetailClient';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Allow any slug (dynamic from API)
export const dynamicParams = true;
export const revalidate = 60;

// Generate static params from API at build time
export async function generateStaticParams() {
  try {
    const projects = await fetchProjects();
    return projects.map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetailClient project={project} locale={locale} />;
}
