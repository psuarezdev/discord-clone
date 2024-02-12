import { type NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/user';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string; channelId: string } }) {
  try {
    const { serverId, channelId } = params;
    const { name, type } = await req.json();

    if(!name || !type) {
      return NextResponse.json(
        { message: 'name and type are required' },
        { status: 400 }
      );
    }

    if(name === 'general') {
      return NextResponse.json(
        { message: 'name cannot be "general"' },
        { status: 400 }
      );
    }

    const authUser = await getProfile();

    if(!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const server = await db.server.update({
      where: { 
        id: serverId, 
        members: {
          some: {
            userId: authUser.id,
            role: {
              in: ['ADMIN', 'MODERATOR']
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              name: {
                not: 'general'
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    });

    if(!server) {
      return NextResponse.json(
        { message: 'Error deleting channel' },
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

export async function DELETE(req: NextRequest, { params }: { params: { serverId: string; channelId: string } }) {
  try {
    const { serverId, channelId } = params;

    const authUser = await getProfile();

    if(!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const server = await db.server.update({
      where: { 
        id: serverId, 
        members: {
          some: {
            userId: authUser.id,
            role: {
              in: ['ADMIN', 'MODERATOR']
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    });

    if(!server) {
      return NextResponse.json(
        { message: 'Error deleting channel' },
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