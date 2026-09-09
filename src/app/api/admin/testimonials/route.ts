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
