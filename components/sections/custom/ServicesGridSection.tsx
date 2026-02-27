"use client";

import { motion } from 'framer-motion';
import {
  Clapperboard,
  Film,
  Palette,
  Megaphone,
  Camera,
  Box,
  Bot,
  PenTool,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type ServiceCategory = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  titleKey: string;
  specKeys: string[];
  accentColor: string;
  gradient: string;
};

const categories: ServiceCategory[] = [
  {
    icon: Clapperboard,
    titleKey: 'cat1Title',
    specKeys: ['cat1s1', 'cat1s2', 'cat1s3', 'cat1s4'],
    accentColor: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Film,
    titleKey: 'cat2Title',
    specKeys: ['cat2s1', 'cat2s2', 'cat2s3', 'cat2s4', 'cat2s5', 'cat2s6'],
    accentColor: '#F97316',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: Palette,
    titleKey: 'cat3Title',
    specKeys: ['cat3s1', 'cat3s2', 'cat3s3', 'cat3s4', 'cat3s5', 'cat3s6'],
    accentColor: '#EC4899',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: Megaphone,
    titleKey: 'cat4Title',
    specKeys: ['cat4s1', 'cat4s2', 'cat4s3', 'cat4s4', 'cat4s5'],
    accentColor: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Camera,
    titleKey: 'cat5Title',
    specKeys: ['cat5s1', 'cat5s2', 'cat5s3', 'cat5s4', 'cat5s5'],
    accentColor: '#F59E0B',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    icon: Box,
    titleKey: 'cat6Title',
    specKeys: ['cat6s1', 'cat6s2', 'cat6s3', 'cat6s4'],
    accentColor: '#06B6D4',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    icon: Bot,
    titleKey: 'cat7Title',
    specKeys: ['cat7s1', 'cat7s2'],
    accentColor: '#D946EF',
    gradient: 'from-fuchsia-500 to-purple-600',
  },
  {
    icon: PenTool,
    titleKey: 'cat8Title',
    specKeys: ['cat8s1', 'cat8s2', 'cat8s3', 'cat8s4'],
    accentColor: '#F43F5E',
    gradient: 'from-rose-500 to-red-600',
  },
];

export default function ServicesGridSection() {
  const t = useTranslations('CustomServices');

  return (
    <section
      className="relative pb-20 sm:pb-28 md:pb-36 overflow-hidden"
    >
      {/* Services Rows - Full Width */}
      <div className="border-t border-white/10">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.titleKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative border-b border-white/10 transition-colors duration-300 hover:bg-white/2 cursor-pointer"
          >

            <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto relative">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 md:py-16 items-center">
                {/* Left: Icon & Title */}
                <div className="lg:col-span-12 xl:col-span-5 flex gap-5 md:gap-6 items-center">
                  <div
                    className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-linear-to-br ${cat.gradient} shadow-lg`}
                    style={{ boxShadow: `0 8px 24px ${cat.accentColor}20` }}
                  >
                    <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                      {t(cat.titleKey)}
                    </h3>
                  </div>
                </div>

                {/* Right: Service List */}
                <div className="lg:col-span-12 xl:col-span-7 flex flex-wrap gap-2 md:gap-3 content-center">
                  {cat.specKeys.map((key, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm text-white font-medium bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/10 transition-colors duration-300"
                    >
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
