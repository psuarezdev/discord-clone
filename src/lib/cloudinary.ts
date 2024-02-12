import { v2 as cloudinary } from 'cloudinary';
import type { CloudinaryResponse } from '@/types.d';
import { MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from './utils';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_APY_SECRET
});

export async function upload(file: File) {
  if(file.size > MAX_FILE_SIZE) return null;
  if(!SUPPORTED_FILE_TYPES.includes(file.type)) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      ).end(buffer);
    });

    return response as CloudinaryResponse;
  } catch (err) {
    return null;
  }
}

export async function destroy(public_id: string) {
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (err) {
    return null;
  }
}
