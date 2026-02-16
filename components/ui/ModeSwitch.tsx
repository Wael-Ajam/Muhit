"use client";

import { motion } from "framer-motion";
import { useHomepageMode } from "@/contexts/HomepageModeContext";
import { useTranslations } from "next-intl";

interface ModeSwitchProps {
  theme?: "dark" | "light";
}

export default function ModeSwitch({ theme = "dark" }: ModeSwitchProps) {
  const { mode, toggleMode } = useHomepageMode();
  const t = useTranslations("ModeSwitch");
  const isPackage = mode === "package";
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleMode}
      className="relative inline-flex items-center rounded-full p-[3px] transition-all duration-500 cursor-pointer"
      style={{
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
        backdropFilter: "blur(12px)",
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 4px 24px rgba(0,0,0,0.08)",
      }}
      aria-label={t("toggleMode")}
    >
      {/* Background pill indicator */}
      <motion.div
        className="absolute top-[3px] bottom-[3px] rounded-full z-0"
        layout
        animate={{
          left: isPackage ? "50%" : "3px",
          right: isPackage ? "3px" : "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          background: "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
          boxShadow:
            "0 4px 16px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.15)",
        }}
      />

      {/* Package label (left) */}
      <span
        className={`relative z-10 w-1/2 text-center py-3 md:py-3.5 text-sm md:text-base font-bold transition-colors duration-300 whitespace-nowrap tracking-wide ${
          isPackage ? "text-white" : isDark ? "text-white" : "text-slate-700"
        }`}
        style={{ minWidth: "120px" }}
      >
        {t("package")}
      </span>

      {/* Custom label (right) */}
      <span
        className={`relative z-10 w-1/2 text-center py-3 md:py-3.5 text-sm md:text-base font-bold transition-colors duration-300 whitespace-nowrap tracking-wide ${
          !isPackage ? "text-white" : isDark ? "text-white" : "text-slate-700"
        }`}
        style={{ minWidth: "120px" }}
      >
        {t("custom")}
      </span>
    </button>
  );
}
