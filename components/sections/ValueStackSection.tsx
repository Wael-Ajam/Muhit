"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCheck, Clock, Star, Handshake } from 'lucide-react';

const icons = [CheckCheck, Clock, Star, Handshake];

function PhraseBox({
  phrase,
  index,
}: {
  phrase: string;
  index: number;
}) {
  const Icon = icons[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="relative aspect-square border border-white/[0.07] flex flex-col items-center justify-center p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 overflow-hidden group"
    >
      {/* Accent bottom bar */}
      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-700 ease-out bg-white/30" />

      {/* Top-left corner glow */}
      <span className="absolute -top-10 -left-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-white" />

      {/* Icon */}
      <div className="mb-5 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 bg-white/[0.06] border border-white/10">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white/60" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3
        className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-medium leading-[1.3] text-center relative z-10"
        style={{ color: '#F2F2F3' }}
      >
        {phrase}
      </h3>
    </motion.div>
  );
}

export default function ValueStackSection() {
  const t = useTranslations('ValueStack');

  const phrases = [
    t('phrase4'),
    t('phrase3'),
    t('phrase2'),
    t('phrase1'),
  ];

  return (
    <section className="relative w-full">
      <div className="w-full grid grid-cols-2 lg:grid-cols-4">
        {phrases.map((phrase, index) => (
          <PhraseBox key={index} phrase={phrase} index={index} />
        ))}
      </div>
    </section>
  );
}
