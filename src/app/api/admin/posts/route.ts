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
