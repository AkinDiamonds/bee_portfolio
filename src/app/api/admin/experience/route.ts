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
