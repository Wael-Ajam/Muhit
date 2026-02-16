"use client";

import { motion } from 'framer-motion';
import { useDirection } from '@/hooks/useDirection';

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  titleHighlight?: string;
  titleEnd?: string;
  subtitle?: string;
  align?: 'center' | 'start';
  className?: string;
}

export default function SectionHeader({
  badge,
  badgeIcon,
  title,
  titleHighlight,
  titleEnd,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const { direction } = useDirection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`${align === 'center' ? 'text-center' : ''} mb-12 md:mb-16 lg:mb-20 ${className}`}
      style={{ direction }}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm mb-6 md:mb-8">
          {badgeIcon || <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />}
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
        <span className="text-slate-800">{title} </span>
        {titleHighlight && (
          <span className="text-orange-500">
            {titleHighlight}
          </span>
        )}
        {titleEnd && (
          <span className="text-slate-800"> {titleEnd}</span>
        )}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
