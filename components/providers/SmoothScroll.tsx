"use client";

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Expose Lenis type on window for other components
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mobile = isTouchDevice();

    const lenis = new Lenis({
      // Mobile: shorter & snappier | Desktop: smooth & elegant
      duration: mobile ? 0.6 : 0.8,
      easing: mobile
        ? (t) => 1 - Math.pow(1 - t, 2)      // snappy ease-out
        : (t) => 1 - Math.pow(1 - t, 2.5),    // smoother ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: mobile ? 1.8 : 2.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
