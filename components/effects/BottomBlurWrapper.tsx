"use client";

import dynamic from 'next/dynamic';

const DynamicBottomBlur = dynamic(
  () => import('@/components/effects/DynamicBottomBlur'),
  { ssr: false }
);

export default function BottomBlurWrapper() {
  return <DynamicBottomBlur />;
}
