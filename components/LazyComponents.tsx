"use client";

import dynamic from 'next/dynamic';

// Lazy load heavy sections that are below the fold
export const LazyWorkflowSection = dynamic(
  () => import('@/components/sections/WorkflowSection'),
  { 
    loading: () => <div className="min-h-screen bg-slate-900" />,
    ssr: true 
  }
);

export const LazyFAQSection = dynamic(
  () => import('@/components/sections/FAQSection'),
  { 
    loading: () => <div className="min-h-[500px] bg-slate-900" />,
    ssr: true 
  }
);

export const LazyTeamSection = dynamic(
  () => import('@/components/sections/TeamSection'),
  { 
    loading: () => <div className="min-h-[600px] bg-slate-100" />,
    ssr: true 
  }
);

export const LazySpecializationsSection = dynamic(
  () => import('@/components/sections/SpecializationsSection'),
  { 
    loading: () => <div className="min-h-screen bg-[#0a0a1f]" />,
    ssr: true 
  }
);

export const LazyCreativeNetworkSection = dynamic(
  () => import('@/components/sections/CreativeNetworkSection'),
  { 
    loading: () => <div className="min-h-screen bg-[#0a0a1f]" />,
    ssr: true 
  }
);

export const LazyPricingSection = dynamic(
  () => import('@/components/sections/PricingSection'),
  { 
    loading: () => <div className="min-h-[600px] bg-slate-900" />,
    ssr: true 
  }
);

export const LazyGetStartedSection = dynamic(
  () => import('@/components/sections/GetStartedSection'),
  { 
    loading: () => <div className="min-h-[500px] bg-slate-900" />,
    ssr: true 
  }
);

export const LazyWorksGridSection = dynamic(
  () => import('@/components/sections/WorksGridSection'),
  { 
    loading: () => <div className="min-h-[400px] bg-slate-900" />,
    ssr: true 
  }
);

export const LazyBookMeeting = dynamic(
  () => import('@/components/sections/BookMeeting'),
  { 
    loading: () => <div className="min-h-[400px] bg-slate-900" />,
    ssr: true 
  }
);

export const LazyCustomFAQSection = dynamic(
  () => import('@/components/sections/CustomFAQSection'),
  { 
    loading: () => <div className="min-h-[500px] bg-slate-900" />,
    ssr: true 
  }
);

export const LazyClientLogosGrid = dynamic(
  () => import('@/components/sections/ClientLogosGrid'),
  { 
    loading: () => <div className="min-h-[300px] bg-[#0a0a1f]" />,
    ssr: true 
  }
);
