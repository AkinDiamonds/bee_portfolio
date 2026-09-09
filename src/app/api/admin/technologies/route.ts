import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';

interface TechPayload {
  frontend: string[];
  backendDevops: string[];
  aiEngineering: string[];
}

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as TechPayload;

  const db = getAdminDb();
  const batch = db.batch();

  batch.set(db.collection('technologies').doc('frontend'), {
    category: 'Frontend',
    items: body.frontend,
    order: 1,
  });

  batch.set(db.collection('technologies').doc('backend-devops'), {
    category: 'Backend & DevOps',
    items: body.backendDevops,
    order: 2,
  });

  batch.set(db.collection('technologies').doc('ai-engineering'), {
    category: 'AI Engineering',
    items: body.aiEngineering,
    order: 3,
  });

  await batch.commit();

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
