"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type HomepageMode = 'package' | 'custom';

interface HomepageModeContextType {
  mode: HomepageMode;
  setMode: (mode: HomepageMode) => void;
  toggleMode: () => void;
}

const HomepageModeContext = createContext<HomepageModeContextType>({
  mode: 'package',
  setMode: () => {},
  toggleMode: () => {},
});

export function HomepageModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<HomepageMode>('package');

  const toggleMode = () => {
    setMode(prev => prev === 'package' ? 'custom' : 'package');
    // Scroll to top on mode change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <HomepageModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </HomepageModeContext.Provider>
  );
}

export function useHomepageMode() {
  return useContext(HomepageModeContext);
}
