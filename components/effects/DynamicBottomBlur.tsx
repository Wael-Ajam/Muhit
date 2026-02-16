"use client";

import { useEffect, useState } from 'react';
import GradualBlur from '@/components/ui/GradualBlur';

export default function DynamicBottomBlur() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setFooterVisible(entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{ opacity: footerVisible ? 0 : 1, transition: 'opacity 0.5s ease' }}
    >
      <GradualBlur
        target="page"
        position="bottom"
        height="10rem"
        strength={2}
        divCount={2}
        curve="bezier"
        exponential
        opacity={footerVisible ? 0 : 1}
      />
    </div>
  );
}

