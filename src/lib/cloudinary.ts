import { v2 as cloudinary } from 'cloudinary';

export function getCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      `Cloudinary configuration missing: ${[
        !cloud_name && 'CLOUDINARY_CLOUD_NAME',
        !api_key && 'CLOUDINARY_API_KEY',
        !api_secret && 'CLOUDINARY_API_SECRET',
      ]
        .filter(Boolean)
        .join(', ')}`
    );
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return cloudinary;
}

export { cloudinary };

