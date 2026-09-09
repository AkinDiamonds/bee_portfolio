// src/lib/firestore.ts
// All server-side Firestore reads. Import getAdminDb from firebase-admin.
// These are async functions — all callers must be async Server Components or API routes.

import { getAdminDb } from './firebase-admin';
import type { Query } from 'firebase-admin/firestore';
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
    let query: Query = db
      .collection('posts')
      .orderBy('publishedAt', 'desc');
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
