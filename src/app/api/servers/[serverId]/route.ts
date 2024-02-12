import { v4 as uuidv4 } from 'uuid';
import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { destroy } from '@/lib/cloudinary';
import { getProfile } from '@/lib/user';

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const { serverId } = params; 
    const { name, image } = await req.json();

    const authUser = await getProfile();

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if(!name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    if(image && (!image.id || !image.url)) {
      return NextResponse.json(
        { message: 'Image is required' },
        { status: 400 }
      );
    }

    const serverFound = await db.server.findUnique({
      where: {
        id: serverId,
        userId: authUser.id
      }
    });

    if (!serverFound) {
      return NextResponse.json(
        { message: 'Server not found' },
        { status: 404 }
      );
    }

    if(image) await destroy(serverFound.imageId);
    
    const server = await db.server.update({
      where: {
        id: serverId,
        userId: authUser.id
      },
      data: {
        userId: authUser.id,
        name: name ?? serverFound.name,
        imageId: image?.id ?? serverFound.imageId,
        imageUrl: image?.url ?? serverFound.imageUrl,
        inviteCode: uuidv4(),
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

export async function DELETE(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const { serverId } = params; 

    const authUser = await getProfile();

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const serverFound = await db.server.findUnique({
      where: {
        id: serverId,
        userId: authUser.id
      }
    });

    if (!serverFound) {
      return NextResponse.json(
        { message: 'Server not found' },
        { status: 404 }
      );
    }

    const serverImageDeleted = await destroy(serverFound.imageId);

    if(!serverImageDeleted) {
      return NextResponse.json(
        { message: 'Error deleting server image' },
        { status: 404 }
      );
    }

    const serverDelted = await db.server.delete({ 
      where: { 
        id: serverId,
        userId: authUser.id 
      } 
    });

    if(!serverDelted) {
      return NextResponse.json(
        { message: 'Error deleting server' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Server deleted successfully' }, 
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}