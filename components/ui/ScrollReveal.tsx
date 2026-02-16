"use client";

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface ScrollRevealProps {
  children: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [baseRotation, 0]);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const words = text.split(/(\s+)/);
    const totalWords = words.filter(w => !w.match(/^\s+$/)).length;
    let wordIndex = 0;

    return words.map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      const i = wordIndex++;
      const startProgress = i / totalWords;
      const endProgress = Math.min(startProgress + 0.3, 1);
      return (
        <RevealWord
          key={index}
          word={word}
          scrollProgress={scrollYProgress}
          startProgress={startProgress}
          endProgress={endProgress}
          baseOpacity={baseOpacity}
          enableBlur={enableBlur}
          blurStrength={blurStrength}
        />
      );
    });
  }, [children, scrollYProgress, baseOpacity, enableBlur, blurStrength]);

  return (
    <motion.div
      ref={containerRef}
      className={`scroll-reveal ${containerClassName}`}
      style={{ transformOrigin: '0% 50%', rotate }}
    >
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </motion.div>
  );
};

function RevealWord({
  word,
  scrollProgress,
  startProgress,
  endProgress,
  baseOpacity,
  enableBlur,
  blurStrength,
}: {
  word: string;
  scrollProgress: MotionValue<number>;
  startProgress: number;
  endProgress: number;
  baseOpacity: number;
  enableBlur: boolean;
  blurStrength: number;
}) {
  const opacity = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    [baseOpacity, 1]
  );

  const filter = useTransform(
    scrollProgress,
    [startProgress, endProgress],
    enableBlur ? [`blur(${blurStrength}px)`, 'blur(0px)'] : ['none', 'none']
  );

  return (
    <motion.span
      className="scroll-reveal-word"
      style={{ opacity, filter, display: 'inline-block' }}
    >
      {word}
    </motion.span>
  );
}

export default ScrollReveal;
