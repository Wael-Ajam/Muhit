// Shared project data — used by both portfolio listing and individual project pages

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  // Layout types: landscape (full width), portrait (side-by-side), square (2-3 per row)
  layout: 'full' | 'half' | 'tall' | 'landscape' | 'portrait' | 'square';
  // Optional dimension data from smart upload
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface Project {
  id: number;
  slug: string;
  category: string;
  image: string;
  video: string | null;
  isVideo: boolean;
  // Translation keys (actual text comes from i18n)
  titleKey: string;
  descKey: string;
  longDescKey: string;
  storyPara2Key: string;
  storyPara3Key: string;
  tagKeys: string[];
  // Gallery media for detail page
  gallery: MediaItem[];
  // Optional website URL for client
  websiteUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "integrated-ad-campaign",
    category: 'motion',
    image: "",
    video: "",
    isVideo: true,
    titleKey: 'project1Title',
    descKey: 'project1Desc',
    longDescKey: 'project1LongDesc',
    storyPara2Key: 'project1StoryPara2',
    storyPara3Key: 'project1StoryPara3',
    tagKeys: ['tagMotion', 'tagDesign', 'tagMarketing'],
    websiteUrl: 'https://www.wsm.org.sa',
    gallery: [
      { type: 'image', src: '', layout: 'full' },
      { type: 'video', src: '', layout: 'half' },
      { type: 'video', src: '', layout: 'half' },
      { type: 'video', src: '', layout: 'full' },
      { type: 'video', src: '', layout: 'half' },
      { type: 'video', src: '', layout: 'half' },
      { type: 'video', src: '', layout: 'half' },
    ],
  },
  {
    id: 2,
    slug: "full-brand-identity",
    category: 'design',
    image: "",
    video: "",
    isVideo: true,
    titleKey: 'project2Title',
    descKey: 'project2Desc',
    longDescKey: 'project2LongDesc',
    storyPara2Key: 'project2StoryPara2',
    storyPara3Key: 'project2StoryPara3',
    tagKeys: ['tagDesign', 'tagVisualIdentity', 'tagDevelopment'],
    gallery: [
      { type: 'video', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'half' },
    ],
  },
  {
    id: 3,
    slug: "motion-promo-video",
    category: 'motion',
    image: "",
    video: "",
    isVideo: true,
    titleKey: 'project3Title',
    descKey: 'project3Desc',
    longDescKey: 'project3LongDesc',
    storyPara2Key: 'project3StoryPara2',
    storyPara3Key: 'project3StoryPara3',
    tagKeys: ['tagMotion', 'tagDesign', 'tagMarketing'],
    gallery: [
      { type: 'video', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'full' },
    ],
  },
  {
    id: 4,
    slug: "advanced-ecommerce-store",
    category: 'development',
    image: "",
    video: null,
    isVideo: false,
    titleKey: 'project4Title',
    descKey: 'project4Desc',
    longDescKey: 'project4LongDesc',
    storyPara2Key: 'project4StoryPara2',
    storyPara3Key: 'project4StoryPara3',
    tagKeys: ['tagDevelopment', 'tagDesign', 'tagEcommerce'],
    gallery: [
      { type: 'image', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'full' },
    ],
  },
  {
    id: 5,
    slug: "mobile-app",
    category: 'development',
    image: "",
    video: null,
    isVideo: false,
    titleKey: 'project5Title',
    descKey: 'project5Desc',
    longDescKey: 'project5LongDesc',
    storyPara2Key: 'project5StoryPara2',
    storyPara3Key: 'project5StoryPara3',
    tagKeys: ['tagDevelopment', 'tagDesign', 'tagUIUX'],
    gallery: [
      { type: 'image', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'full' },
    ],
  },
  {
    id: 6,
    slug: "social-media-campaign",
    category: 'marketing',
    image: "",
    video: "",
    isVideo: true,
    titleKey: 'project6Title',
    descKey: 'project6Desc',
    longDescKey: 'project6LongDesc',
    storyPara2Key: 'project6StoryPara2',
    storyPara3Key: 'project6StoryPara3',
    tagKeys: ['tagMarketing', 'tagDesign', 'tagAdCampaigns'],
    gallery: [
      { type: 'video', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'full' },
      { type: 'image', src: '', layout: 'half' },
      { type: 'image', src: '', layout: 'half' },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project | null; next: Project | null } {
  const index = projects.findIndex(p => p.slug === slug);
  return {
    prev: index > 0 ? projects[index - 1] : projects[projects.length - 1],
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  };
}
