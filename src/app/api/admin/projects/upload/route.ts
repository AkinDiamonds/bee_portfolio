import { NextResponse } from 'next/server';
import { getAdminBucket } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../../auth';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const slug = formData.get('slug') as string | null;

  if (!file || !slug) {
    return NextResponse.json({ error: 'file and slug are required' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  const maxSize = 52_428_800; // 50 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop() ?? 'bin';
  const storagePath = `project-media/${slug}/${Date.now()}.${ext}`;

  const bucket = getAdminBucket();
  const storageFile = bucket.file(storagePath);
  await storageFile.save(buffer, { contentType: file.type });
  await storageFile.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return NextResponse.json({ url: publicUrl, demoType: file.type.startsWith('video/') ? 'video' : 'image' });
}
