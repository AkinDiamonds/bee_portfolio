# plan_04 — API Write Routes

**Goal:** Create all Next.js API route handlers that the admin forms will POST to. These routes authenticate with HTTP Basic Auth, write to Firestore via the Admin SDK, and trigger on-demand revalidation.

**Prerequisite:** plan_01 and plan_03 complete.

---

## Overview of routes to create

| File | Method | Action |
|---|---|---|
| `src/app/api/admin/site/route.ts` | POST | Save `site/profile` document |
| `src/app/api/admin/projects/route.ts` | POST | Save/upsert a project document |
| `src/app/api/admin/projects/route.ts` | DELETE | Delete a project document |
| `src/app/api/admin/projects/upload/route.ts` | POST | Upload demo media to Storage |
| `src/app/api/admin/experience/route.ts` | POST | Save/upsert an experience entry |
| `src/app/api/admin/experience/route.ts` | DELETE | Delete an experience entry |
| `src/app/api/admin/technologies/route.ts` | POST | Save all three tech category docs |
| `src/app/api/admin/testimonials/route.ts` | POST | Save/upsert a testimonial |
| `src/app/api/admin/testimonials/route.ts` | DELETE | Delete a testimonial |
| `src/app/api/admin/posts/route.ts` | POST | Save/upsert a blog post |
| `src/app/api/admin/posts/route.ts` | DELETE | Delete a blog post |
| `src/app/api/admin/resume/route.ts` | POST | Upload resume PDF to Storage |

---

## Auth helper module

Create `src/app/api/admin/auth.ts` — a shared utility used by every route:

```ts
// src/app/api/admin/auth.ts
export function checkBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Basic ')) return false;
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) return false;
  const user = decoded.slice(0, colonIndex);
  const pass = decoded.slice(colonIndex + 1);
  return (
    user === process.env.ADMIN_BASIC_AUTH_USERNAME &&
    pass === process.env.ADMIN_BASIC_AUTH_PASSWORD
  );
}
```

---

## `src/app/api/admin/site/route.ts`

```ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { SiteProfile } from '@/lib/types';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<SiteProfile>;

  const db = getAdminDb();
  await db
    .collection('site')
    .doc('profile')
    .set({ ...body, updatedAt: new Date().toISOString() }, { merge: true });

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

---

## `src/app/api/admin/projects/route.ts`

```ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { ProjectDoc } from '@/lib/types';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<ProjectDoc> & { slug: string };

  if (!body.slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const db = getAdminDb();
  await db
    .collection('projects')
    .doc(body.slug)
    .set({ ...body, updatedAt: new Date().toISOString() }, { merge: true });

  revalidatePath('/');

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = (await request.json()) as { slug: string };

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const db = getAdminDb();
  await db.collection('projects').doc(slug).delete();

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

---

## `src/app/api/admin/projects/upload/route.ts`

This route accepts a `multipart/form-data` file upload. It uploads to Firebase Storage and returns the public URL.

```ts
import { NextResponse } from 'next/server';
import { getAdminBucket } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../../auth';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const slug = formData.get('slug') as string | null;

  if (!file || !slug) {
    return NextResponse.json({ error: 'file and slug are required' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  const maxSize = 52_428_800; // 50 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop() ?? 'bin';
  const storagePath = `project-media/${slug}/${Date.now()}.${ext}`;

  const bucket = getAdminBucket();
  const storageFile = bucket.file(storagePath);
  await storageFile.save(buffer, { contentType: file.type });
  await storageFile.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return NextResponse.json({ url: publicUrl, demoType: file.type.startsWith('video/') ? 'video' : 'image' });
}
```

---

## `src/app/api/admin/experience/route.ts`

```ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { ExperienceDoc } from '@/lib/types';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as ExperienceDoc;

  if (!body.role || !body.company || !body.startDate) {
    return NextResponse.json({ error: 'role, company, and startDate are required' }, { status: 400 });
  }

  const db = getAdminDb();
  // Use existing id for updates, or auto-generate for new entries
  const docRef = body.id
    ? db.collection('experience').doc(body.id)
    : db.collection('experience').doc();
  await docRef.set({ role: body.role, company: body.company, startDate: body.startDate, endDate: body.endDate ?? '' });

  revalidatePath('/');

  return NextResponse.json({ success: true, id: docRef.id });
}

export async function DELETE(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = (await request.json()) as { id: string };

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const db = getAdminDb();
  await db.collection('experience').doc(id).delete();

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

---

## `src/app/api/admin/technologies/route.ts`

The admin saves all three categories at once. Each payload item maps to a fixed doc ID.

```ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';

interface TechPayload {
  frontend: string[];
  backendDevops: string[];
  aiEngineering: string[];
}

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as TechPayload;

  const db = getAdminDb();
  const batch = db.batch();

  batch.set(db.collection('technologies').doc('frontend'), {
    category: 'Frontend',
    items: body.frontend,
    order: 1,
  });

  batch.set(db.collection('technologies').doc('backend-devops'), {
    category: 'Backend & DevOps',
    items: body.backendDevops,
    order: 2,
  });

  batch.set(db.collection('technologies').doc('ai-engineering'), {
    category: 'AI Engineering',
    items: body.aiEngineering,
    order: 3,
  });

  await batch.commit();

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

---

## `src/app/api/admin/testimonials/route.ts`

```ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { TestimonialDoc } from '@/lib/types';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as TestimonialDoc;

  if (!body.quote || !body.name) {
    return NextResponse.json({ error: 'quote and name are required' }, { status: 400 });
  }

  const db = getAdminDb();
  const docRef = body.id
    ? db.collection('testimonials').doc(body.id)
    : db.collection('testimonials').doc();
  await docRef.set({ ...body, updatedAt: new Date().toISOString() }, { merge: true });

  revalidatePath('/');

  return NextResponse.json({ success: true, id: docRef.id });
}

export async function DELETE(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = (await request.json()) as { id: string };
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const db = getAdminDb();
  await db.collection('testimonials').doc(id).delete();

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

---

## `src/app/api/admin/posts/route.ts`

```ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { BlogPostDoc } from '@/lib/types';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as BlogPostDoc;

  if (!body.slug || !body.title || !body.body) {
    return NextResponse.json({ error: 'slug, title, and body are required' }, { status: 400 });
  }

  const db = getAdminDb();
  await db
    .collection('posts')
    .doc(body.slug)
    .set({ ...body, updatedAt: new Date().toISOString() }, { merge: true });

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = (await request.json()) as { slug: string };
  if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 });

  const db = getAdminDb();
  await db.collection('posts').doc(slug).delete();

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');

  return NextResponse.json({ success: true });
}
```

---

## `src/app/api/admin/resume/route.ts`

```ts
import { NextResponse } from 'next/server';
import { getAdminBucket, getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  const maxSize = 10_485_760; // 10 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = getAdminBucket();
  const storageFile = bucket.file('resume/resume.pdf');
  await storageFile.save(buffer, { contentType: 'application/pdf' });
  await storageFile.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/resume/resume.pdf`;

  // Also update the resumeUrl field in site/profile
  const db = getAdminDb();
  await db.collection('site').doc('profile').set({ resumeUrl: publicUrl, updatedAt: new Date().toISOString() }, { merge: true });

  return NextResponse.json({ url: publicUrl });
}
```

---

## Verification

After creating all route files, run:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

To manually test that auth is working, run this curl command (replace username/password with values from `.env.local`):

```bash
curl -X POST http://localhost:3000/api/admin/site \
  -H "Authorization: Basic $(echo -n 'Simeon:Simeon' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"heroName":"Test"}'
```

Expected response: `{"success":true}` with HTTP 200.
Without the Authorization header: `{"error":"Unauthorized"}` with HTTP 401.

---

## Done checklist

- [ ] `src/app/api/admin/auth.ts` created
- [ ] `src/app/api/admin/site/route.ts` created
- [ ] `src/app/api/admin/projects/route.ts` created (POST + DELETE)
- [ ] `src/app/api/admin/projects/upload/route.ts` created
- [ ] `src/app/api/admin/experience/route.ts` created (POST + DELETE)
- [ ] `src/app/api/admin/technologies/route.ts` created
- [ ] `src/app/api/admin/testimonials/route.ts` created (POST + DELETE)
- [ ] `src/app/api/admin/posts/route.ts` created (POST + DELETE)
- [ ] `src/app/api/admin/resume/route.ts` created
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Manual curl test returns `{"success":true}` with correct credentials
- [ ] Manual curl test returns 401 without credentials
