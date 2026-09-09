// src/app/api/admin/posts-read/route.ts
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { BlogPostDoc } from '@/lib/types';

export async function GET(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('posts').orderBy('publishedAt', 'desc').get();
    const docs = snap.docs.map((d) => ({ ...d.data(), slug: d.id } as BlogPostDoc));
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json([]);
  }
}
