"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

export default function Showreel({ showreelDesktop = '', showreelMobile = '', showreelDesktopPoster = '', showreelMobilePoster = '' }: { showreelDesktop?: string; showreelMobile?: string; showreelDesktopPoster?: string; showreelMobilePoster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const showreelRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Showreel parallax
  const { scrollYProgress: showreelScrollProgress } = useScroll({
    target: showreelRef,
    offset: ["start end", "end start"]
  });
  const showreelY = useTransform(showreelScrollProgress, [0, 1], ['-5%', '5%']);
  const showreelScale = useTransform(showreelScrollProgress, [0, 0.5, 1], [1.1, 1.05, 1.1]);

  // Toggle play/pause for both videos
  const togglePlay = useCallback(() => {
    const desktop = videoRef.current;
    const mobile = mobileVideoRef.current;
    
    if (isPlaying) {
      desktop?.pause();
      mobile?.pause();
      setIsPlaying(false);
    } else {
      desktop?.play().catch(() => {});
      mobile?.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Pause video when out of view
  useEffect(() => {
    const video = videoRef.current;
    const mobile = mobileVideoRef.current;
    const target = video || mobile;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            video?.pause();
            mobile?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Set video to a specific second so it shows a frame instead of blank
  useEffect(() => {
    const setStartTime = (video: HTMLVideoElement | null, startSecond: number) => {
      if (video) {
        const handler = () => { video.currentTime = startSecond; };
        video.addEventListener('loadedmetadata', handler);
        return () => video.removeEventListener('loadedmetadata', handler);
      }
    };
    const cleanupDesktop = setStartTime(videoRef.current, 1);
    const cleanupMobile = setStartTime(mobileVideoRef.current, 2);
    return () => { cleanupDesktop?.(); cleanupMobile?.(); };
  }, []);

  return (
    <div id="showreel" className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24 relative z-10">
      <div
        ref={showreelRef}
        className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl"
        style={{
          height: 'clamp(500px, 90vh, 1100px)',
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            y: showreelY,
            scale: showreelScale,
          }}
        >
          {/* Desktop Video or Placeholder */}
          {showreelDesktop ? (
              <video
                ref={videoRef}
                className="hidden md:block w-full h-full object-cover"
                loop
                playsInline
                preload="auto"
                poster={showreelDesktopPoster || undefined}
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = 'none';
                }}
              >
                <source src={showreelDesktop} type="video/mp4" />
              </video>
            ) : (
              <div className="hidden md:flex w-full h-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1e2e 0%, #0d1b2a 100%)' }}>
                <div className="flex flex-col items-center gap-4 opacity-50">
                  <svg className="w-16 h-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                  <span className="text-amber-300 text-lg font-medium">شوريل سطح المكتب</span>
                </div>
              </div>
            )}

          {/* Mobile Video or Placeholder */}
          {showreelMobile ? (
              <video
                ref={mobileVideoRef}
                className="block md:hidden w-full h-full object-cover"
                loop
                playsInline
                preload="auto"
                poster={showreelMobilePoster || undefined}
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = 'none';
                }}
              >
                <source src={showreelMobile} type="video/mp4" />
              </video>
            ) : (
              <div className="flex md:hidden w-full h-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1e2e 0%, #0d1b2a 100%)' }}>
                <div className="flex flex-col items-center gap-4 opacity-50">
                  <svg className="w-14 h-14 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                  <span className="text-amber-300 text-base font-medium">شوريل الموبايل</span>
                </div>
              </div>
            )}
        </motion.div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full backdrop-blur-md transition-all duration-300 ${
              isPlaying 
                ? 'bg-black/20 opacity-0 group-hover:opacity-100' 
                : 'bg-black/30 border border-white/20 shadow-2xl'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
            )}
          </motion.div>
        </button>

        {/* Subtle Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.1) 100%)',
          }}
        />
      </div>


    </div>
  );
}
