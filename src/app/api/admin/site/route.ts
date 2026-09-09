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
