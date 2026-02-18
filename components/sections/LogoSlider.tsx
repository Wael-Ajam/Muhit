"use client";

import { useEffect, useRef, useState } from 'react';
import './LogoSlider.css';

// Logo data — matching silver and colored PNG versions
const logos = [
  { name: 'Hadia', silver: '/logos/silver/Hadia.png', colored: '/logos/colored/Hadia.png' },
  { name: 'King Faisal', silver: '/logos/silver/King Faisal.png', colored: '/logos/colored/King Faisal.png' },
  { name: 'Total', silver: '/logos/silver/Total.png', colored: '/logos/colored/Total.png' },
  { name: 'UNICEF', silver: '/logos/silver/unicef.png', colored: '/logos/colored/unicef.png' },
  { name: 'البنوك الاقتصادية', silver: '/logos/silver/البنوك الاقتصادية.png', colored: '/logos/colored/البنوك السعودية.png' },
  { name: 'الجزيرة', silver: '/logos/silver/الجزيرة.png', colored: '/logos/colored/الجزيرة.png' },
  { name: 'السبيعي', silver: '/logos/silver/السبيعي.png', colored: '/logos/colored/السبيعي.png' },
  { name: 'المجدوعي', silver: '/logos/silver/المجدوعي.png', colored: '/logos/colored/المجدوعي.png' },
  { name: 'المخبر الاقتصادي', silver: '/logos/silver/المخبر الاقتصادي.png', colored: '/logos/colored/المخبر الاقتصادي.png' },
  { name: 'المواصفات', silver: '/logos/silver/المواصفات.png', colored: '/logos/colored/المواصفات.png' },
  { name: 'إمارة المنطقة', silver: '/logos/silver/امارة المنطقة.png', colored: '/logos/colored/امارة المنطقة.png' },
  { name: 'جسارة', silver: '/logos/silver/جسارة.png', colored: '/logos/colored/جسارة.png' },
  { name: 'ركن الحوار', silver: '/logos/silver/ركن الحوار.png', colored: '/logos/colored/ركن الحوار.png' },
  { name: 'مجلس المؤسسات', silver: '/logos/silver/مجلس المؤسسات.png', colored: '/logos/colored/مجلس المؤسسة.png' },
  { name: 'نقي', silver: '/logos/silver/نقي.png', colored: '/logos/colored/نقي.png' },
  { name: 'هيئة التراث', silver: '/logos/silver/هيئة التراث.png', colored: '/logos/colored/هيئة التراث.png' },
  { name: 'وزارة الصحة', silver: '/logos/silver/وزارة الصحة.png', colored: '/logos/colored/وزارة الصحة.png' },
  { name: 'وزارة الحج', silver: '/logos/silver/وزارو الحج.png', colored: '/logos/colored/وزارو الحج.png' },
];

export default function LogoSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideDistance, setSlideDistance] = useState(0);

  // Measure exact width of one logo set after images load
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // Total scrollWidth / 3 = exact pixel width of one set
        const oneSetWidth = trackRef.current.scrollWidth / 3;
        setSlideDistance(oneSetWidth);
      }
    };

    // Measure after a short delay to let images render
    const timer = setTimeout(measure, 500);
    // Also measure on window resize
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Triple logos for seamless infinite scroll
  const duplicated = [...logos, ...logos, ...logos];

  return (
    <div className="pb-8 md:pb-12">

      <div className="logo-slider">
        <div
          ref={trackRef}
          className="logo-slider-track"
          style={slideDistance > 0 ? {
            '--slide-distance': `-${slideDistance}px`,
            animation: 'logoSlide 50s linear infinite',
          } as React.CSSProperties : undefined}
        >
          {duplicated.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="logo-slider-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.silver}
                alt={logo.name}
                className="logo-silver"
                loading="lazy"
                draggable={false}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.colored}
                alt={logo.name}
                className="logo-colored"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
