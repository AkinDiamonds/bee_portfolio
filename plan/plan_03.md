# plan_03 — Data Types & Server-Side Firestore Read Functions

**Goal:** Create `src/lib/types.ts` (all TypeScript interfaces) and `src/lib/firestore.ts` (all async Firestore read functions using Admin SDK). Update every component and page that currently imports from `src/lib/content.ts` to import from the new files instead.

**Prerequisite:** plan_01 and plan_02 complete.

---

## Step 1 — Create `src/lib/types.ts`

Create a **new file** at `src/lib/types.ts`. It must not exist yet. Copy this exactly:

```ts
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
```

---

## Step 2 — Create `src/lib/firestore.ts`

Create a **new file** at `src/lib/firestore.ts`. Copy this exactly:

```ts
// src/lib/firestore.ts
// All server-side Firestore reads. Import getAdminDb from firebase-admin.
// These are async functions — all callers must be async Server Components or API routes.

import { getAdminDb } from './firebase-admin';
import type {
  SiteProfile,
  ProjectDoc,
  ExperienceDoc,
  TechCategoryDoc,
  TestimonialDoc,
  BlogPostDoc,
} from './types';

// ─── Site profile (singleton) ────────────────────────────────────────────────

export async function getSiteProfile(): Promise<SiteProfile | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('site').doc('profile').get();
    if (!snap.exists) return null;
    return snap.data() as SiteProfile;
  } catch {
    return null;
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(visibleOnly = true): Promise<ProjectDoc[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('projects').orderBy('order', 'asc').get();
    const docs = snap.docs.map((d) => ({ ...d.data(), slug: d.id } as ProjectDoc));
    return visibleOnly ? docs.filter((d) => d.visibility) : docs;
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDoc | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('projects').doc(slug).get();
    if (!snap.exists) return null;
    const data = snap.data() as ProjectDoc;
    return { ...data, slug: snap.id };
  } catch {
    return null;
  }
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function getExperience(): Promise<ExperienceDoc[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('experience').get();
    const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ExperienceDoc));
    // Sort newest first by startDate string (lexicographic — works for "YYYY" or "Mon YYYY")
    return docs.sort((a, b) => b.startDate.localeCompare(a.startDate));
  } catch {
    return [];
  }
}

export function formatExperiencePeriod(item: ExperienceDoc): string {
  if (!item.endDate || item.startDate === item.endDate) return item.startDate;
  if (item.endDate.toLowerCase() === 'present') return `${item.startDate} — Present`;
  return `${item.startDate} — ${item.endDate}`;
}

// ─── Technologies ─────────────────────────────────────────────────────────────

export async function getTechStack(): Promise<TechCategoryDoc[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('technologies').orderBy('order', 'asc').get();
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as TechCategoryDoc));
  } catch {
    return [];
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(visibleOnly = true): Promise<TestimonialDoc[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('testimonials').orderBy('order', 'asc').get();
    const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id } as TestimonialDoc));
    return visibleOnly ? docs.filter((d) => d.visibility) : docs;
  } catch {
    return [];
  }
}

// ─── Blog posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(
  limitCount?: number,
  visibleOnly = true,
): Promise<BlogPostDoc[]> {
  try {
    const db = getAdminDb();
    let query = db
      .collection('posts')
      .orderBy('publishedAt', 'desc') as FirebaseFirestore.Query;
    if (limitCount) query = query.limit(limitCount);
    const snap = await query.get();
    const docs = snap.docs.map((d) => ({ ...d.data(), slug: d.id } as BlogPostDoc));
    return visibleOnly ? docs.filter((d) => d.visibility) : docs;
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDoc | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('posts').doc(slug).get();
    if (!snap.exists) return null;
    const data = snap.data() as BlogPostDoc;
    return { ...data, slug: snap.id };
  } catch {
    return null;
  }
}
```

---

## Step 3 — Update `src/app/page.tsx`

Replace the current `page.tsx` entirely. Change it from a sync function to an `async` function and switch all imports from `@/lib/content` to `@/lib/firestore`:

```tsx
// src/app/page.tsx
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import WorkExperience from "@/components/experience/WorkExperience";
import Testimonials from "@/components/testimonials/Testimonials";
import TechStack from "@/components/tech/TechStack";
import LatestBlogs from "@/components/blog/LatestBlogs";
import Footer from "@/components/footer/Footer";
import PortfolioAgent from "@/components/agent/PortfolioAgent";
import {
  getSiteProfile,
  getTestimonials,
  getTechStack,
  getBlogPosts,
  getProjects,
  getExperience,
} from "@/lib/firestore";

export default async function Home() {
  const [profile, testimonials, techStack, blogPosts, projects, experience] =
    await Promise.all([
      getSiteProfile(),
      getTestimonials(true),
      getTechStack(),
      getBlogPosts(5, true),
      getProjects(true),
      getExperience(),
    ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar profile={profile} />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)]">
        <Hero profile={profile} />
        <FeaturedProjects projects={projects} />
        <WorkExperience experience={experience} />
        <Testimonials testimonials={testimonials} />
        <TechStack techStack={techStack} />
        <LatestBlogs posts={blogPosts} />
        <Footer profile={profile} />
      </main>
      <PortfolioAgent />
    </div>
  );
}
```

---

## Step 4 — Update component prop signatures (stubs only)

The components now receive data as props instead of calling `content.ts` internally.
Update each component signature so TypeScript is satisfied. **Do not change the JSX/rendering yet** — that happens in later plans. Just change the signature and remove the internal data-fetching call.

### `src/components/hero/Hero.tsx`

Change:
```tsx
export default function Hero() {
```
To:
```tsx
import type { SiteProfile } from "@/lib/types";
interface HeroProps { profile: SiteProfile | null }
export default function Hero({ profile }: HeroProps) {
```

Remove the `"use client"` directive if it exists (check the file — Hero has no interactivity, so it should be a Server Component). The current Hero.tsx has `"use client"` at the top — **remove that line**.

### `src/components/nav/Navbar.tsx`

Change the function signature to accept a `profile` prop. Keep `"use client"` (the navbar has state):
```tsx
import type { SiteProfile } from "@/lib/types";
interface NavbarProps { profile: SiteProfile | null }
export default function Navbar({ profile }: NavbarProps) {
```

The hardcoded `contactLinks` array stays in the file for now — wiring happens in plan_06.
TypeScript will not complain because `profile` is accepted but not yet used.

### `src/components/footer/Footer.tsx`

```tsx
import type { SiteProfile } from "@/lib/types";
interface FooterProps { profile: SiteProfile | null }
export default function Footer({ profile }: FooterProps) {
```

### `src/components/projects/FeaturedProjects.tsx`

Remove the internal `getProjects()` call. Accept `projects` as a prop:

```tsx
import type { ProjectDoc } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface FeaturedProjectsProps { projects: ProjectDoc[] }
export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section
      id="featured-projects"
      aria-label="Featured Projects"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <h2 className="mb-[var(--spacing-8)] text-[length:var(--text-heading-h3)] font-[number:var(--font-weight-semibold)] tracking-[var(--tracking-tight-heading)] text-[var(--color-text-primary)] md:text-[length:var(--text-heading-h2)]">
        Featured Projects
      </h2>
      <div id="projects" className="scroll-mt-8 flex flex-col gap-[var(--spacing-4)]">
        {projects.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
```

Note: `ProjectCard` currently expects the old `ProjectData` type from `content.ts`. In this step,
update the import in `ProjectCard.tsx` to use `ProjectDoc` from `@/lib/types` and rename references.
`ProjectDoc` has the same fields as `ProjectData` except: `demoVideo`/`demoImage` are replaced by
`demoUrl`/`demoType`. Update any references to `demoVideo`/`demoImage` in `ProjectCard.tsx` to use
`project.demoUrl` and `project.demoType`. Full ProjectCard wiring is in plan_10.

### `src/components/experience/WorkExperience.tsx`

Remove internal `getExperience()` call. Accept `experience` as a prop:

```tsx
import type { ExperienceDoc } from "@/lib/types";
import { formatExperiencePeriod } from "@/lib/firestore";

interface WorkExperienceProps { experience: ExperienceDoc[] }
export default function WorkExperience({ experience }: WorkExperienceProps) {
  // ... keep existing JSX, just rename `experiences` variable to `experience` throughout
```

### `src/components/testimonials/Testimonials.tsx`

The component already accepts `testimonials` as a prop (from current `page.tsx`).
Update the import to use `TestimonialDoc` from `@/lib/types` instead of `TestimonialItem` from `@/lib/content`.
Check the current type name used in the file and update accordingly.

### `src/components/tech/TechStack.tsx`

The component already accepts `techStack` as a prop.
Update the import to use `TechCategoryDoc` from `@/lib/types` instead of `TechCategory` from `@/lib/content`.

### `src/components/blog/LatestBlogs.tsx`

The component already accepts `posts` as a prop.
Update the import to use `BlogPostDoc` from `@/lib/types` instead of `BlogPostData` from `@/lib/content`.
In the component JSX, update any reference from `post.date` to `post.publishedAt` and from `post.content` to `post.body`.

---

## Step 5 — Update blog pages

### `src/app/blog/page.tsx`

Replace the file:

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPosts, getSiteProfile } from "@/lib/firestore";
import styles from "./BlogPage.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on product engineering, systems, and AI.",
};

export default async function BlogIndexPage() {
  const [posts, profile] = await Promise.all([
    getBlogPosts(undefined, true),
    getSiteProfile(),
  ]);

  return (
    <div className={styles.page}>
      <Navbar profile={profile} />
      <main className={styles.main}>
        <h1 className={styles.title}>Blog</h1>
        <div className={styles.list}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.post}>
              <p className={styles.meta}>{post.publishedAt} · {post.category}</p>
              <h2 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readLink}>Read article →</Link>
            </article>
          ))}
          {posts.length === 0 && (
            <p className={styles.excerpt}>No posts published yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
```

### `src/app/blog/[slug]/page.tsx`

Replace the file:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPostBySlug, getSiteProfile } from "@/lib/firestore";
import styles from "../BlogPage.module.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteProfile(),
  ]);

  if (!post || !post.visibility) notFound();

  return (
    <div className={styles.page}>
      <Navbar profile={profile} />
      <main className={styles.main}>
        <Link href="/blog" className={styles.backLink}>← Back to blog</Link>
        <article className={styles.article}>
          <p className={styles.meta}>{post.publishedAt} · {post.category}</p>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>
      </main>
    </div>
  );
}
```

Note: sanitize-html is added to the blog detail page in plan_12. For now, `post.body` renders directly.
This is safe because only you (via the admin) can write to `posts` — the public cannot publish.

---

## Step 6 — Remove `generateStaticParams` from blog detail page

The old `blog/[slug]/page.tsx` had `generateStaticParams` that read from the filesystem.
The new version above does not include it — that is intentional. Without `generateStaticParams`,
Next.js will render the page dynamically (SSR) on each request, which is correct for CMS-driven content.

---

## Step 7 — Check for any remaining imports from `@/lib/content`

Run this search to find any file still importing from `content.ts`:

```bash
grep -r "from.*@/lib/content" src/
```

Fix each one by updating the import path to either `@/lib/firestore` or `@/lib/types`.
`content.ts` must have zero importers at this point.

---

## Verification

```bash
npm run build
npm run lint
npx tsc --noEmit
```

**Expected build behavior:** The build will succeed. The homepage and blog pages will show empty sections because Firestore has no data yet. That is expected — data entry happens after the admin UI is built in plans 06–11.

If `npm run build` fails with a Firestore error, confirm `FIREBASE_ADMIN_SERVICE_ACCOUNT` is in `.env.local` and the dev server was restarted after plan_01.

---

## Done checklist

- [ ] `src/lib/types.ts` created with all 6 interfaces
- [ ] `src/lib/firestore.ts` created with all 8 read functions
- [ ] `src/app/page.tsx` updated to async, imports from firestore.ts, passes props to all components
- [ ] `Hero.tsx` accepts `profile` prop, `"use client"` removed
- [ ] `Navbar.tsx` accepts `profile` prop
- [ ] `Footer.tsx` accepts `profile` prop
- [ ] `FeaturedProjects.tsx` accepts `projects` prop, no internal data call
- [ ] `WorkExperience.tsx` accepts `experience` prop, no internal data call
- [ ] `Testimonials.tsx` updated to use `TestimonialDoc` type
- [ ] `TechStack.tsx` updated to use `TechCategoryDoc` type
- [ ] `LatestBlogs.tsx` updated to use `BlogPostDoc` type
- [ ] `src/app/blog/page.tsx` replaced
- [ ] `src/app/blog/[slug]/page.tsx` replaced
- [ ] `grep -r "from.*@/lib/content" src/` returns zero results
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
