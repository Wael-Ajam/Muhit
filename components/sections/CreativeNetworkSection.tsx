"use client";

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/hooks/useDirection';
import { 
  User, 
  UserCircle2,
  Lightbulb,
  Palette,
  Code,
  Pen,
  Video,
  Camera,
  Box,
  Megaphone,
  BarChart3,
  Bot,
  Headphones,
  Globe,
  LucideIcon
} from 'lucide-react';

type TeamMember = {
  id: string;
  icon: LucideIcon;
  labelKey: string;
  color: string;
};

// Network Node Component
function NetworkNode({ 
  member, 
  t,
  size = 'md',
  delay = 0,
  showLabel = true
}: { 
  member: TeamMember;
  t: (key: string) => string;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  delay?: number;
  showLabel?: boolean;
}) {
  const IconComponent = member.icon;
  
  const sizeClasses = {
    xl: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    md: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    sm: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12'
  };
  
  const iconSizes = {
    xl: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
    lg: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10',
    md: 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7',
    sm: 'w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5'
  };
  
  const textSizes = {
    xl: 'text-sm sm:text-base md:text-lg font-bold',
    lg: 'text-xs sm:text-sm md:text-base font-semibold',
    md: 'text-[10px] sm:text-xs md:text-sm font-medium',
    sm: 'text-[9px] sm:text-[10px] md:text-xs font-medium'
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center gap-2 relative"
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
    >
      {/* Node Circle with Glow */}
      <motion.div 
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center cursor-pointer group`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${member.color}40, ${member.color}15, transparent)`,
          border: `2px solid ${member.color}60`,
          boxShadow: `0 0 40px ${member.color}30, inset 0 0 30px ${member.color}15`,
        }}
        whileHover={{ 
          scale: 1.15,
          boxShadow: `0 0 60px ${member.color}50, inset 0 0 40px ${member.color}25`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full"
          style={{ border: `1px solid ${member.color}40` }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.6, 0, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: delay }}
        />
        
        <IconComponent 
          className={iconSizes[size]}
          strokeWidth={1.5}
          style={{ color: member.color }}
        />
      </motion.div>
      
      {/* Label */}
      {showLabel && (
        <span 
          className={`${textSizes[size]} text-center max-w-[70px] sm:max-w-[90px] md:max-w-[110px] leading-tight`}
          style={{ color: member.color }}
        >
          {t(member.labelKey)}
        </span>
      )}
    </motion.div>
  );
}

export default function CreativeNetworkSection() {
  const t = useTranslations('Network');
  const { direction } = useDirection();
  const containerRef = useRef<HTMLDivElement>(null);

  // Pyramid structure
  const pyramid = {
    top: { id: 'client', icon: User, labelKey: 'client', color: '#F97316' },
    level2: { id: 'account-manager', icon: UserCircle2, labelKey: 'accountManager', color: '#8B5CF6' },
    level3: [
      { id: 'creative-director', icon: Lightbulb, labelKey: 'creativeDirector', color: '#EC4899' },
      { id: 'strategist', icon: BarChart3, labelKey: 'strategist', color: '#64748B' },
    ],
    level4: [
      { id: 'graphic-designer', icon: Palette, labelKey: 'graphicDesigner', color: '#06B6D4' },
      { id: 'motion-designer', icon: Video, labelKey: 'motionDesigner', color: '#F59E0B' },
      { id: 'developer', icon: Code, labelKey: 'developer', color: '#EF4444' },
      { id: 'content-writer', icon: Pen, labelKey: 'contentWriter', color: '#3B82F6' },
    ],
    level5: [
      { id: 'ui-ux', icon: Globe, labelKey: 'uiUx', color: '#10B981' },
      { id: '3d-artist', icon: Box, labelKey: '3dArtist', color: '#A855F7' },
      { id: 'photographer', icon: Camera, labelKey: 'photographer', color: '#14B8A6' },
      { id: 'marketer', icon: Megaphone, labelKey: 'marketer', color: '#F472B6' },
      { id: 'ai-specialist', icon: Bot, labelKey: 'aiSpecialist', color: '#D946EF' },
      { id: 'sound-designer', icon: Headphones, labelKey: 'soundDesigner', color: '#0EA5E9' },
    ],
  };

  return (
    <section 
      ref={containerRef}
      data-nav-theme="dark"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a1f 0%, #0d0d26 50%, #0a0a1f 100%)',
      }}
    >

      
      <div className="relative z-10 px-4 md:px-6 lg:px-16 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          style={{ direction }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-5"
          >
            {t('badge')}
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {t('title')} <span className="text-orange-500">{t('titleHighlight')}</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Pyramid Network Structure */}
        <div className="relative flex flex-col items-center gap-6 md:gap-8">
          
          {/* Level 1 - Client (Top) */}
          <div className="relative">
            <NetworkNode member={pyramid.top} t={t} size="xl" delay={0} />
            {/* Connector down */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[2px] h-6 md:h-8 bg-gradient-to-b from-orange-500/50 to-purple-500/50 rounded-full" />
          </div>
          
          {/* Level 2 - Account Manager */}
          <div className="relative">
            <NetworkNode member={pyramid.level2} t={t} size="lg" delay={0.1} />
            {/* Connectors */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[2px] h-4 md:h-6 bg-gradient-to-b from-purple-500/40 to-pink-500/40 rounded-full" />
          </div>
          
          {/* Level 3 - Directors */}
          <div className="flex items-center justify-center gap-16 sm:gap-24 md:gap-32 lg:gap-48 relative">
            {/* Left branch */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-32 sm:w-48 md:w-64 lg:w-80 h-[2px] bg-gradient-to-r from-pink-500/30 via-purple-500/50 to-gray-500/30 rounded-full" />
            
            {pyramid.level3.map((member, i) => (
              <div key={member.id} className="relative">
                <NetworkNode member={member} t={t} size="md" delay={0.2 + i * 0.1} />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[1px] h-4 md:h-5 bg-gradient-to-b from-current/30 to-transparent" style={{ color: member.color }} />
              </div>
            ))}
          </div>
          
          {/* Level 4 - Specialists */}
          <div className="relative w-full max-w-2xl">
            {/* Connector bar */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-48 sm:w-64 md:w-80 lg:w-[500px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent rounded-full" />
            
            <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full place-items-center">
              {pyramid.level4.map((member, i) => (
                <NetworkNode 
                  key={member.id} 
                  member={member} 
                  t={t} 
                  size="sm" 
                  delay={0.4 + i * 0.08}
                />
              ))}
            </div>
          </div>
          
          {/* Level 5 - Team */}
          <div className="relative w-full max-w-3xl">
            {/* Connector bar */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-56 sm:w-72 md:w-96 lg:w-[600px] h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent rounded-full" />
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2 w-full pt-2 place-items-center">
              {pyramid.level5.map((member, i) => (
                <NetworkNode 
                  key={member.id} 
                  member={member} 
                  t={t} 
                  size="sm" 
                  delay={0.6 + i * 0.05}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats - Narrative Flow */}
        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full" style={{ direction }}>
            {[
              { value: '1', labelKey: 'subscription', color: '#8B5CF6' },
              { value: '14+', labelKey: 'specializations', color: '#F97316' },
              { value: '∞', labelKey: 'possibilities', color: '#06B6D4' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6 sm:gap-8 md:gap-12">
                {/* Stat */}
                <div className="text-center">
                  <div 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-xs sm:text-sm md:text-base mt-2">
                    {t(stat.labelKey)}
                  </div>
                </div>

                {/* Arrow (not after last item) */}
                {i < 2 && (
                  <div style={{ transform: direction === 'rtl' ? 'scaleX(-1)' : 'none' }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mx-2 sm:mx-3"
                    >
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="url(#arrow-grad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="arrow-grad" x1="9" y1="6" x2="15" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F97316" stopOpacity="0.6" />
                          <stop offset="1" stopColor="#FB923C" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


