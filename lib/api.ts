import { ApiProject } from './types';

// Server-side: direct connection to NestJS (avoids DNS loopback)
// Client-side: uses the public URL through nginx proxy
const API_BASE =
  typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL || 'http://127.0.0.1:3001/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');

/**
 * Fetch all published projects (server-side, cached for 60s)
 */
export async function fetchProjects(category?: string): Promise<ApiProject[]> {
  const params = new URLSearchParams({ published: 'true' });
  if (category) params.set('category', category);

  try {
    const res = await fetch(`${API_BASE}/projects?${params}`, {
      next: { revalidate: 1 },
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    console.error('[fetchProjects] API unreachable');
    return [];
  }
}

/**
 * Fetch all site settings (server-side, cached for 60s)
 */
export async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return {};
    return res.json();
  } catch {
    console.error('[fetchSettings] API unreachable');
    return {};
  }
}

/**
 * Fetch a single project by slug (server-side, cached for 60s)
 */
export async function fetchProjectBySlug(slug: string): Promise<ApiProject | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/slug/${slug}`, {
      next: { revalidate: 1 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    console.error(`[fetchProjectBySlug] API unreachable for slug: ${slug}`);
    return null;
  }
}
