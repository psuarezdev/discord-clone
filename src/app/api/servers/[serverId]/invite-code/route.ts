import { v4 as uuidv4 } from 'uuid';
import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getProfile } from '@/lib/user';

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
  try {
    const authUser = await getProfile();

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!params.serverId) {
      return NextResponse.json(
        { message: 'Invalid server ID' },
        { status: 404 }
      );
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        userId: authUser.id
      },
      data: {
        inviteCode: uuidv4()
      }
    });

    if(!server) {
      return NextResponse.json(
        { message: 'Error creating invite code' },
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