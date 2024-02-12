import { v4 as uuidv4 } from 'uuid';
import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getProfile } from '@/lib/user';

export async function POST(req: NextRequest) {
  try {
    const { name, image } = await req.json();

    const authUser = await getProfile();

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if(!name || !image) {
      return NextResponse.json(
        { message: 'Name and image are required' },
        { status: 400 }
      );
    }

    const server = await db.server.create({
      data: {
        userId: authUser.id,
        name,
        imageId: image.id,
        imageUrl: image.url,
        inviteCode: uuidv4(),
        channels: {
          create: { name: 'general', userId: authUser.id }
        },
        members: {
          create: { userId: authUser.id, role: 'ADMIN' }
        }
      }
    });

    return NextResponse.json({ server }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}