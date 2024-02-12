import { type NextRequest, NextResponse } from 'next/server';
import { ChannelType } from '@prisma/client';
import { getProfile } from '@/lib/user';
import db from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const { serverId } = params;
    const { name, type } = await req.json();

    const authUser = await getProfile();

    if(!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if(!name || !type) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if(name.trim().toLowerCase() === 'general') {
      return NextResponse.json(
        { message: 'Invalid channel name' },
        { status: 400 }
      );
    }

    if(!Object.values(ChannelType).includes(type)) {
      return NextResponse.json(
        { message: 'Invalid channel type' },
        { status: 400 }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: authUser.id,
            role: { in: ['ADMIN', 'MODERATOR'] }
          }
        }
      },
      data: {
        channels: {
          create: { name, type, userId: authUser.id }
        }
      }
    });

    if(!server) {
      return NextResponse.json(
        { message: 'Error creating channel' },
        { status: 404 }
      );
    } 

    return NextResponse.json(server);
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}