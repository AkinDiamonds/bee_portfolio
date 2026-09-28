import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAdminDb } from '@/lib/firebase-admin';
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

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads');

    // Ensure uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Read previous resume URL from profile if available
    let oldResumeUrl: string | undefined;
    try {
      const db = getAdminDb();
      const profileDoc = await db.collection('site').doc('profile').get();
      if (profileDoc.exists) {
        oldResumeUrl = profileDoc.data()?.resumeUrl;
      }
    } catch (e) {
      console.warn('Could not read existing profile doc:', e);
    }

    // Save the new resume file with timestamp to prevent caching issues
    const filename = `resume-${Date.now()}.pdf`;
    const newFilePath = path.join(uploadDir, filename);
    await fs.writeFile(newFilePath, buffer);

    // Also overwrite public/resume.pdf so standard /resume.pdf links always resolve
    const defaultResumePath = path.join(publicDir, 'resume.pdf');
    await fs.writeFile(defaultResumePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Clean up previous uploaded resume in public/uploads if it's different
    if (oldResumeUrl && oldResumeUrl.startsWith('/uploads/')) {
      const oldFilename = path.basename(oldResumeUrl);
      if (oldFilename !== filename) {
        const oldFilePath = path.join(uploadDir, oldFilename);
        try {
          await fs.unlink(oldFilePath);
        } catch {
          // Ignore if previous file doesn't exist
        }
      }
    }

    // Update the resumeUrl field in site/profile
    try {
      const db = getAdminDb();
      await db.collection('site').doc('profile').set(
        { resumeUrl: publicUrl, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (dbErr) {
      console.warn('Could not update Firestore profile:', dbErr);
    }

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('Error saving resume to repo:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save resume' },
      { status: 500 }
    );
  }
}
