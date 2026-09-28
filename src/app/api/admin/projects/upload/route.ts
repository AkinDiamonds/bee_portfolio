import { NextResponse } from 'next/server';
import { getCloudinary } from '@/lib/cloudinary';
import { checkBasicAuth } from '../../auth';
import type { UploadApiResponse } from 'cloudinary';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: 'file and slug are required' }, { status: 400 });
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    const maxSize = 100 * 1024 * 1024; // 100 MB limit
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File exceeds 100 MB limit' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const buffer = Buffer.from(await file.arrayBuffer());
    const cld = getCloudinary();

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cld.uploader.upload_stream(
        {
          folder: `bee_portfolio/projects/${slug}`,
          resource_type: isVideo ? 'video' : 'image',
          overwrite: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            return reject(error || new Error('Cloudinary upload returned undefined'));
          }
          resolve(uploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      demoType: isVideo ? 'video' : 'image',
    });
  } catch (error) {
    console.error('[Upload Error details]:', error);
    const message = error instanceof Error ? error.message : typeof error === 'object' && error !== null ? JSON.stringify(error) : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

