'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function sendBeacon(endpoint: string, data: Record<string, string>) {
  try {
    const url = `${API_BASE}/analytics/${endpoint}`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, JSON.stringify(data));
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silently fail — analytics should never break the site
  }
}

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    sendBeacon('pageview', {
      page: pathname,
      referrer: document.referrer || '',
    });
  }, [pathname]);
}

export function trackButtonClick(buttonId: string, page?: string, label?: string) {
  const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '');
  sendBeacon('click', {
    buttonId,
    page: currentPage,
    label: label || '',
  });
}
