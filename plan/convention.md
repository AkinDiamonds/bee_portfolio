# Convention Reference — Firebase Backend Migration

> Every plan file in this directory follows these conventions. Read this once before reading any plan.

---

## Project root

```
c:\Dev\projects\personal\bee_portfolio\
```

All file paths below are relative to that root unless stated otherwise.

---

## Tech stack (do not deviate)

| Concern | Choice |
|---|---|
| Framework | Next.js 15, App Router, `src/` directory |
| Language | TypeScript — strict mode |
| Styling | Tailwind CSS v4, CSS-first via `@theme` in `src/app/globals.css` |
| Database | Firestore (Firebase Admin SDK — server-side only) |
| File storage | Cloudinary (Free tier — server-side upload API) |
| Auth gate | HTTP Basic Auth on all `/admin` and `/api/admin/*` routes |

---

## Absolute rules

1. **No client-side Firestore reads or writes.** The browser never calls `getFirestore()` for data. All Firestore access goes through Next.js Server Components or API route handlers using `getAdminDb()` from `src/lib/firebase-admin.ts`.
2. **No arbitrary Tailwind values.** Every size/color/spacing must use a token defined in `src/app/globals.css` (`var(--...)`). If a token is missing, add it to `globals.css` first.
3. **No component over ~150 lines.** Split into sub-components before that limit.
4. **Server Components by default.** Add `"use client"` only where state, effects, or browser APIs are required.
5. **On-demand revalidation on every write.** Every API route that mutates data must call `revalidatePath` before returning its response. See the revalidation targets list below.
6. **`src/lib/content.ts` is legacy.** After plan_03 is done, nothing new should import from it. It will be deleted in plan_13.

---

## Directory map (key files)

```
src/
  app/
    globals.css              <- design tokens (Tailwind @theme)
    layout.tsx               <- root layout, no data fetching
    page.tsx                 <- home page — async Server Component, fetches all data
    admin/
      page.tsx               <- renders AdminDashboard (protected by middleware)
      AdminDashboard.tsx     <- tabbed admin shell
      tabs/
        SiteDataTab.tsx      <- all non-blog admin forms
        BlogTab.tsx          <- blog list + Tiptap editor
      forms/
        ProfileForm.tsx      <- site/profile fields
        TechForm.tsx         <- technologies
        ExperienceForm.tsx   <- experience entries
        TestimonialsForm.tsx <- testimonials
        ProjectsForm.tsx     <- projects (with file upload)
    api/
      admin/
        site/route.ts        <- POST site/profile
        projects/route.ts    <- POST/DELETE projects
        projects/upload/route.ts <- POST upload to Storage
        experience/route.ts  <- POST/DELETE experience
        technologies/route.ts <- POST all three tech categories
        testimonials/route.ts <- POST/DELETE testimonials
        posts/route.ts       <- POST/DELETE blog posts
        resume/route.ts      <- POST upload resume PDF
    blog/
      page.tsx               <- /blog list page (async Server Component)
      [slug]/
        page.tsx             <- /blog/[slug] detail page (async Server Component)
  components/
    admin/
      TiptapEditor.tsx       <- blog rich-text editor ("use client")
    hero/Hero.tsx
    nav/Navbar.tsx
    footer/Footer.tsx
    projects/FeaturedProjects.tsx
    experience/WorkExperience.tsx
    tech/TechStack.tsx
    testimonials/Testimonials.tsx
    blog/LatestBlogs.tsx
  lib/
    types.ts                 <- ALL TypeScript interfaces (single source of truth)
    firestore.ts             <- ALL server-side Firestore read functions
    firebase-admin.ts        <- getAdminDb(), getAdminBucket() (existing)
    firebase.ts              <- client SDK init (existing, keep — unused after migration)
    content.ts               <- LEGACY — delete after plan_13
```

---

## Firestore collections & document shapes

### `site/profile` (singleton)

```ts
{
  heroName: string;          // "Simeon Akinrinola"
  heroTagline: string;       // "Building better software, faster."
  heroSubtitle: string;      // "Frontend, Backend, and AI Engineering."
  footerQuote: string;       // The bee humor line
  githubUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;       // full wa.me URL
  email: string;
  calUrl: string;
  phone: string;             // copy-to-clipboard value
  resumeUrl: string;         // Firebase Storage download URL
  updatedAt: string;         // ISO timestamp
}
```

### `projects/{slug}`

```ts
{
  slug: string;              // document ID
  title: string;
  summary: string;           // 2-3 sentence card summary
  description: string;       // longer description
  tags: string[];
  type: string;              // e.g. "Frontend & AI"
  demoUrl?: string;          // Firebase Storage download URL
  demoType?: 'image' | 'video';
  award?: { title: string; details: string; badge?: string };
  timeTaken?: string;
  metrics: string[];
  githubUrl?: string;
  liveUrl?: string;
  docsUrl?: string;
  workplace: boolean;
  role?: string;
  duration?: string;
  details?: { overview: string; architecture?: string };
  visibility: boolean;       // false = hidden from frontend
  order: number;             // ascending sort order
  updatedAt: string;
}
```

### `posts/{slug}`

```ts
{
  slug: string;              // document ID, URL-safe
  title: string;
  body: string;              // Tiptap HTML output (stored raw, sanitized at render time)
  category: string;
  excerpt: string;           // plain text, shown in card and <meta description>
  publishedAt: string;       // ISO timestamp
  visibility: boolean;       // false = draft, not shown on frontend
  updatedAt: string;
}
```

> No coverImage field. Blog cards use a dark gradient tile with the title overlaid.

### `experience/{id}`

```ts
{
  role: string;
  company: string;
  startDate: string;         // "Jan 2023" or "2023"
  endDate?: string;          // "Present" or "Dec 2024" or omitted
}
```

Sorted on the frontend by `startDate` descending (newest first). No `order` field needed.

### `technologies/{id}`

Use exactly three document IDs: `frontend`, `backend-devops`, `ai-engineering`.

```ts
{
  category: 'Frontend' | 'Backend & DevOps' | 'AI Engineering';
  items: string[];           // e.g. ["React", "Next.js", "TypeScript"]
  order: number;             // 1, 2, 3 for display sequence
}
```

### `testimonials/{id}`

```ts
{
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;        // paste URL; initials shown if missing
  visibility: boolean;
  order: number;
  updatedAt: string;
}
```

---

## API route auth pattern

Every route under `src/app/api/admin/` must begin with this auth check:

```ts
import { NextResponse } from 'next/server';

function checkBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Basic ')) return false;
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  return (
    user === process.env.ADMIN_BASIC_AUTH_USERNAME &&
    pass === process.env.ADMIN_BASIC_AUTH_PASSWORD
  );
}

// At the top of every handler:
if (!checkBasicAuth(request)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## Revalidation targets

Call these after every write in the relevant API route:

```ts
import { revalidatePath } from 'next/cache';

revalidatePath('/');                    // home page — always call this
revalidatePath('/blog');                // blog list — call for post writes
revalidatePath('/blog/[slug]', 'page'); // individual post — call for post writes
```

---

## Admin client fetch helper

All admin form onSubmit handlers send requests to their API route with the Basic Auth header attached.
The username and password come from component state (entered once in AdminDashboard login prompt).

```ts
const res = await fetch('/api/admin/site', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  },
  body: JSON.stringify(payload),
});
```

Store `{ username, password }` in a React context `AdminAuthContext` provided by AdminDashboard
so every child form can read credentials without prop-drilling.

---

## Blog body sanitization

Blog `body` is stored as raw Tiptap HTML. Before rendering on `/blog/[slug]`, sanitize server-side:

```ts
import sanitizeHtml from 'sanitize-html';

const safeBody = sanitizeHtml(post.body, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'u', 'mark', 'pre', 'code']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['style', 'class'],
    a: ['href', 'target', 'rel'],
  },
});
```

Then render: `<div dangerouslySetInnerHTML={{ __html: safeBody }} />`

---

## Cloudinary media storage

| Content | Resource Type | Cloudinary Folder |
|---|---|---|
| Project demo media | `video` or `image` | `beeportfolio/projects` |
| Resume PDF | `raw` or `auto` | `beeportfolio/resume` |

Media is uploaded securely via `/api/admin/upload` using the Cloudinary Node SDK and basic auth.
Public URL format: Cloudinary `secure_url` (`https://res.cloudinary.com/...`).

---

## Formatting experience dates

Keep this helper in `src/lib/firestore.ts`:

```ts
export function formatExperiencePeriod(item: ExperienceDoc): string {
  if (!item.endDate || item.startDate === item.endDate) return item.startDate;
  if (item.endDate.toLowerCase() === 'present') return `${item.startDate} — Present`;
  return `${item.startDate} — ${item.endDate}`;
}
```

---

## Environment variables required

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | .env.local + Vercel (already set) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | .env.local + Vercel (already set) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | .env.local + Vercel (already set) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | .env.local + Vercel (already set) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | .env.local + Vercel (already set) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | .env.local + Vercel (already set) |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | .env.local + Vercel (already set) |
| `FIREBASE_ADMIN_SERVICE_ACCOUNT` | .env.local + Vercel (**must add — plan_01**) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | .env.local + Vercel (**must add — plan_01**) |
| `CLOUDINARY_API_KEY` | .env.local + Vercel (**must add — plan_01**) |
| `CLOUDINARY_API_SECRET` | .env.local + Vercel (**must add — plan_01**) |
| `ADMIN_BASIC_AUTH_USERNAME` | .env.local + Vercel (already set) |
| `ADMIN_BASIC_AUTH_PASSWORD` | .env.local + Vercel (already set) |

---

## Verification sequence (run after every plan)

```bash
npm run build
npm run lint
npx tsc --noEmit
```

All three must exit with zero errors/warnings before marking a plan done in progress.md.
