'use client';

import { usePageTracking } from '@/app/hooks/useAnalytics';

export default function PageTracker() {
  usePageTracking();
  return null;
}
