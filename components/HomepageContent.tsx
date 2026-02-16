"use client";

import { useHomepageMode } from '@/contexts/HomepageModeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HomepageContentProps {
  packageContent: ReactNode;
  customContent: ReactNode;
}

export default function HomepageContent({ packageContent, customContent }: HomepageContentProps) {
  const { mode } = useHomepageMode();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        {mode === 'package' ? packageContent : customContent}
      </motion.div>
    </AnimatePresence>
  );
}
