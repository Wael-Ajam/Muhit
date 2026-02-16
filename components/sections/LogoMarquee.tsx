"use client";

import LogoLoop from '@/components/LogoLoop';

const LOGOS = [
  { node: <span>BRAND</span>, title: "Brand" },
  { node: <span>STUDIO</span>, title: "Studio" },
  { node: <span>AGENCY</span>, title: "Agency" },
  { node: <span>CREATIVE</span>, title: "Creative" },
  { node: <span>DIGITAL</span>, title: "Digital" },
  { node: <span>MEDIA</span>, title: "Media" },
  { node: <span>DESIGN</span>, title: "Design" },
  { node: <span>VISION</span>, title: "Vision" },
];

export default function LogoMarquee() {
  return (
    <section className="relative w-full py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden">
      <div style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
        <LogoLoop
          logos={LOGOS}
          speed={210}
          direction="right"
          logoHeight={40}
          gap={60}
          hoverSpeed={0}
          fadeOut
          fadeOutColor="#0a0a1f"
          ariaLabel="Our partners"
        />
      </div>
    </section>
  );
}
