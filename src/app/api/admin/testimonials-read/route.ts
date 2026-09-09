// src/app/api/admin/testimonials-read/route.ts
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { TestimonialDoc } from '@/lib/types';

export async function GET(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('testimonials').orderBy('order', 'asc').get();
    const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id } as TestimonialDoc));
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json([]);
  }
}
