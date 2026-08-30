import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export type ProjectType = 'frontend' | 'backend' | 'fullstack' | 'workplace';

export interface Metric {
  label: string;
  before?: string;
  after: string;
  delta?: string;
}

export interface ProjectData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  tags: string[];
  image: string;
  type: ProjectType;
  demoVideo?: string;
  demoImage?: string;
  githubUrl?: string;
  liveUrl?: string;
  metrics?: Metric[];
  workplace?: boolean;
  role?: string;
  duration?: string;
  links?: {
    github?: string;
    live?: string;
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
  role: string;
  company: string;
  startDate: string;
  endDate: string;
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
      type: (data.type as ProjectType) || 'fullstack',
      demoVideo: data.demoVideo,
      demoImage: data.demoImage,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      metrics: data.metrics || [],
      workplace: data.workplace || false,
      role: data.role,
      duration: data.duration,
      links: data.links || {},
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

export function getTestimonials(): TestimonialItem[] {
  const filePath = path.join(contentDirectory, 'testimonials.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}
