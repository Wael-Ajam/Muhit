"use client";

import { useEffect, useRef, useState } from 'react';
import GradualBlur from '@/components/ui/GradualBlur';

export default function DynamicBottomBlur() {
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Use rAF to batch with the next paint — avoids layout thrashing
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setHidden(entries[0].isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(footer);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
        transition: 'opacity 0.4s ease, visibility 0.4s ease',
      }}
    >
      <GradualBlur
        target="page"
        position="bottom"
        height="10rem"
        strength={2}
        divCount={2}
        curve="bezier"
      />
    </div>
  );
}
