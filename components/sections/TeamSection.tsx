"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TeamSection() {
  const t = useTranslations('Team');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const team = [
    {
      id: 1,
      name: t('member1Name'),
      role: t('member1Role'),
      image: "",
      color: "#F97316",
    },
    {
      id: 2,
      name: t('member2Name'),
      role: t('member2Role'),
      image: "",
      color: "#8B5CF6",
    },
    {
      id: 3,
      name: t('member3Name'),
      role: t('member3Role'),
      image: "",
      color: "#06B6D4",
    },
    {
      id: 4,
      name: t('member4Name'),
      role: t('member4Role'),
      image: "",
      color: "#10B981",
    },
    {
      id: 5,
      name: t('member5Name'),
      role: t('member5Role'),
      image: "",
      color: "#EC4899",
    },
  ];

  return (
    <section 
      data-nav-theme="light"
      className="py-24 px-6 lg:px-24 relative overflow-hidden"
      style={{
        background: '#F8F9FC',
      }}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(243, 129, 32, 0.2) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(61, 53, 226, 0.2) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10">
        {/* Section Header - Cinematic Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: 'rgba(243, 129, 32, 0.1)',
              border: '1px solid rgba(243, 129, 32, 0.2)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-600 text-sm font-medium">{t('badge')}</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-slate-800">{t('title')} </span>
            <span className="text-orange-500">
              {t('titleHighlight')}
            </span>
            <span className="text-slate-800"> {t('titleEnd')}</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {team.map((member) => {
            const isHovered = hoveredId === member.id;
            
            return (
              <motion.div
                key={member.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group"
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-cursor-text={t('cursorText')}
              >
                {/* Card */}
                <div 
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${isHovered ? member.color + '40' : 'rgba(255, 255, 255, 0.9)'}`,
                    boxShadow: isHovered 
                      ? `0 20px 40px ${member.color}20, 0 0 0 1px ${member.color}20`
                      : '0 4px 24px rgba(0, 0, 0, 0.06)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-3/4 overflow-hidden">
                    <div 
                      className="absolute inset-0 transition-transform duration-700"
                      style={{
                        ...(member.image ? {
                          backgroundImage: `url(${member.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center top',
                        } : {
                          background: `linear-gradient(135deg, #1e1a2e 0%, ${member.color}22 100%)`,
                        }),
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      {!member.image && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
                          <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          <span className="text-purple-300 text-xs font-medium">صورة العضو {member.id}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Color Overlay on Hover */}
                    <div 
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(180deg, transparent 50%, ${member.color}30 100%)`,
                        opacity: isHovered ? 1 : 0,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 text-center">
                    <h3 
                      className="text-lg font-bold mb-1 transition-colors duration-300"
                      style={{ color: isHovered ? member.color : '#1E293B' }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
