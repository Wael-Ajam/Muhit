"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

function PhraseBox({
  phrase,
  index,
}: {
  phrase: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="relative aspect-square border border-white/[0.07] flex items-center justify-center p-5 sm:p-6 md:p-8 lg:p-10 xl:p-14"
    >
      <motion.h3
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium leading-[1.2] text-center"
        style={{ color: '#F2F2F3' }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {phrase}
      </motion.h3>
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
