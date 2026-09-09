// src/app/api/admin/experience-read/route.ts
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';
import type { ExperienceDoc } from '@/lib/types';

export async function GET(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('experience').get();
    const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ExperienceDoc));
    return NextResponse.json(docs.sort((a, b) => b.startDate.localeCompare(a.startDate)));
  } catch {
    return NextResponse.json([]);
  }
}
