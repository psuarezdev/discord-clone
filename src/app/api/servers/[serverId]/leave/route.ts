import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getProfile } from '@/lib/user';

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const { serverId } = params;

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
        userId: {
          not: authUser.id
        },
        members: {
          some: {
            userId: authUser.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            userId: authUser.id
          }
        }
      } 
    });

    if(!server) {
      return NextResponse.json(
        { message: 'Error leaving server' },
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