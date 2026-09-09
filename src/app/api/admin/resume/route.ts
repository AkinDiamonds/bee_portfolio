import { NextResponse } from 'next/server';
import { getAdminBucket, getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  const maxSize = 10_485_760; // 10 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = getAdminBucket();
  const storageFile = bucket.file('resume/resume.pdf');
  await storageFile.save(buffer, { contentType: 'application/pdf' });
  await storageFile.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/resume/resume.pdf`;

  // Also update the resumeUrl field in site/profile
  const db = getAdminDb();
  await db.collection('site').doc('profile').set({ resumeUrl: publicUrl, updatedAt: new Date().toISOString() }, { merge: true });

  return NextResponse.json({ url: publicUrl });
}
