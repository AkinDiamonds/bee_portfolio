import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export interface ProjectAward {
  title: string;
  details: string;
  badge?: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  summary?: string;
  tags: string[];
  type?: string;
  demoVideo?: string;
  demoImage?: string;
  image?: string;
  award?: ProjectAward;
  timeTaken?: string;
  metrics?: string[];
  githubUrl?: string;
  liveUrl?: string;
  docsUrl?: string;
  workplace?: boolean;
  role?: string;
  duration?: string;
  details?: {
    overview: string;
    architecture?: string;
  };
  content?: string;
}

export interface BlogPostData {
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  coverImage: string;
  content?: string;
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export function getProjects(): ProjectData[] {
  const projectsDir = path.join(contentDirectory, 'projects');
  if (!fs.existsSync(projectsDir)) return [];
  const filenames = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  return filenames.map((filename) => {
    const filePath = path.join(projectsDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      title: data.title || '',
      slug: data.slug || filename.replace(/\.mdx?$/, ''),
      summary: data.summary || '',
      description: data.description || '',
      tags: data.tags || [],
      image: data.image || '',
      type: data.type || 'Frontend & AI',
      demoVideo: data.demoVideo,
      demoImage: data.demoImage,
      award: data.award,
      timeTaken: data.timeTaken,
      metrics: data.metrics || [],
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      docsUrl: data.docsUrl,
      workplace: data.workplace || false,
      role: data.role,
      duration: data.duration,
      details: data.details,
      content,
    };
  });
}

export function getProjectBySlug(slug: string): ProjectData | null {
  const projects = getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export function getBlogPosts(): BlogPostData[] {
  const blogDir = path.join(contentDirectory, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  const filenames = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  return filenames
    .map((filename) => {
      const filePath = path.join(blogDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        title: data.title || '',
        slug: data.slug || filename.replace(/\.mdx?$/, ''),
        date: data.date || '',
        category: data.category || '',
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || '',
        content,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
}

export function getBlogPostBySlug(slug: string): BlogPostData | null {
  const posts = getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getExperience(): ExperienceItem[] {
  const filePath = path.join(contentDirectory, 'experience.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function formatExperiencePeriod(item: ExperienceItem): string {
  if (!item.endDate || item.startDate === item.endDate) {
    return item.startDate;
  }
  if (item.endDate.toLowerCase() === 'present') {
    return `${item.startDate} — Present`;
  }
  return `${item.startDate} — ${item.endDate}`;
}

export function getTestimonials(): TestimonialItem[] {
  const filePath = path.join(contentDirectory, 'testimonials.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}
