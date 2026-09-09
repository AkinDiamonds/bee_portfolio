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
