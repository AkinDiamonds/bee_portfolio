// src/lib/types.ts
// Single source of truth for all Firestore document shapes.
// Import from here in both lib/firestore.ts and all components.

export interface SiteProfile {
  heroName: string;
  heroTagline: string;
  heroSubtitle: string;
  footerQuote: string;
  githubUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
  email: string;
  calUrl: string;
  phone: string;
  resumeUrl: string;
  updatedAt?: string;
}

export interface ProjectAward {
  title: string;
  details: string;
  badge?: string;
}

export interface ProjectDoc {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  type: string;
  demoUrl?: string;
  demoType?: 'image' | 'video';
  award?: ProjectAward;
  timeTaken?: string;
  metrics: string[];
  githubUrl?: string;
  liveUrl?: string;
  docsUrl?: string;
  workplace: boolean;
  role?: string;
  duration?: string;
  details?: {
    overview: string;
    architecture?: string;
  };
  visibility: boolean;
  order: number;
  updatedAt?: string;
}

export interface ExperienceDoc {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
}

export interface TechCategoryDoc {
  id: string;
  category: 'Frontend' | 'Backend & DevOps' | 'AI Engineering';
  items: string[];
  order: number;
}

export interface TestimonialDoc {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  visibility: boolean;
  order: number;
  updatedAt?: string;
}

export interface BlogPostDoc {
  slug: string;
  title: string;
  body: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  visibility: boolean;
  updatedAt?: string;
}
