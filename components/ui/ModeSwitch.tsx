"use client";

import { motion } from "framer-motion";
import { useHomepageMode } from "@/contexts/HomepageModeContext";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface ModeSwitchProps {
  theme?: "dark" | "light";
}

export default function ModeSwitch({ theme = "dark" }: ModeSwitchProps) {
  const { mode, toggleMode } = useHomepageMode();
  const t = useTranslations("ModeSwitch");
  const isPackage = mode === "package";
  const isDark = theme === "dark";

  // Detect md breakpoint for correct knob positioning
  const [isMd, setIsMd] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia("(min-width: 768px)").matches;
  });
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMd(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mobile knob: 26px + 3px padding = 29px offset
  // Desktop knob: 32px + 3px padding = 35px offset
  const knobRightOffset = isMd ? "calc(100% - 35px)" : "calc(100% - 29px)";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-sm md:text-base font-semibold tracking-widest uppercase self-center text-center ${isDark ? 'text-white/80' : 'text-black/70'}`}
      >
        {t('chooseContract')}
      </motion.span>
      <div className="flex items-center gap-3 md:gap-5">
      {/* Left Label */}
      <motion.span
        className="text-xs md:text-base font-semibold cursor-pointer select-none whitespace-nowrap"
        onClick={() => !isPackage && toggleMode()}
        animate={{
          color: isPackage
            ? "#F97316"
            : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
        }}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {t("package")}
      </motion.span>

      {/* Toggle Track */}
      <button
        onClick={toggleMode}
        className="relative cursor-pointer shrink-0 w-[60px] h-[32px] md:w-[76px] md:h-[40px] rounded-full"
        aria-label={t("toggleMode")}
        style={{
          background: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.08)",
          border: `1px solid ${
            isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
          }`,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Track Glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isPackage
              ? "inset 4px 0 12px rgba(249, 115, 22, 0.15)"
              : "inset -4px 0 12px rgba(249, 115, 22, 0.15)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Circle Knob — mobile: 26px, desktop: 32px */}
        <motion.div
          className="absolute rounded-full w-[26px] h-[26px] md:w-[32px] md:h-[32px] top-[2px] md:top-[3px]"
          animate={{
            left: isPackage ? knobRightOffset : "3px",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            background: "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
            boxShadow: "0 2px 10px rgba(249, 115, 22, 0.5), 0 0 20px rgba(249, 115, 22, 0.2)",
          }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-[-4px] rounded-full border-2 border-orange-400/60"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
            }}
          />
        </motion.div>
      </button>

      {/* Right Label */}
      <motion.span
        className="text-xs md:text-base font-semibold cursor-pointer select-none whitespace-nowrap"
        onClick={() => isPackage && toggleMode()}
        animate={{
          color: !isPackage
            ? "#F97316"
            : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
        }}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {t("custom")}
      </motion.span>
      </div>
    </div>
  );
}
