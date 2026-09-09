// src/app/api/admin/profile-read/route.ts
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';

export async function GET(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminDb();
  const snap = await db.collection('site').doc('profile').get();
  if (!snap.exists) return NextResponse.json(null);
  return NextResponse.json(snap.data());
}
