"use client";

import { useHomepageMode } from '@/contexts/HomepageModeContext';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Grainient = dynamic(() => import('@/components/ui/Grainient'), { ssr: false });

export default function GlobalBackground() {
  const { mode } = useHomepageMode();
  const isCustom = mode === 'custom';

  return (
    <AnimatePresence>
      {isCustom ? (
        <motion.div
          key="global-grainient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <Grainient
            color1="#F97316"
            color2="#011D81"
            color3="#0a0a2e"
            timeSpeed={0.15}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={4}
            warpSpeed={1.5}
            warpAmplitude={60}
            blendAngle={0}
            blendSoftness={0.08}
            rotationAmount={400}
            noiseScale={1.2}
            grainAmount={0.03}
            grainScale={2}
            grainAnimated={false}
            contrast={1.4}
            gamma={1}
            saturation={1.1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
