"use client";

import { useEffect } from "react";
import { useHomepageMode } from "@/contexts/HomepageModeContext";

export default function CustomProjectClient() {
  const { setMode } = useHomepageMode();

  useEffect(() => {
    setMode("custom");
  }, [setMode]);

  return null;
}
