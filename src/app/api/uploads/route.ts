import { type NextRequest, NextResponse } from 'next/server';
import { upload } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    const cloudinaryRes = file instanceof File ? await upload(file) : null;

    if (!cloudinaryRes) {
      return NextResponse.json(
        { message: 'Error uploading file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: cloudinaryRes?.public_id,
      url: cloudinaryRes?.secure_url
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}