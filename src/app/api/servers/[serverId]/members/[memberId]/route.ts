import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getProfile } from '@/lib/user';

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string; memberId: string; } }) {
  try {
    const { serverId, memberId } = params;
    const { role } = await req.json();
    const authUser = await getProfile();

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: authUser.id
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: {
                not: authUser.id
              }
            },
            data: { role }
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { role: 'asc' }
        }
      }
    });

    if (!server) {
      return NextResponse.json(
        { message: 'Error updating member' },
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

export async function DELETE(req: NextRequest, { params }: { params: { serverId: string; memberId: string; } }) {
  try {
    const { serverId, memberId } = params;
    const authUser = await getProfile();

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: authUser.id
      },
      data: {
        members: {
          delete: {
            id: memberId,
            userId: {
              not: authUser.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { role: 'asc' }
        }
      }
    });

    if (!server) {
      return NextResponse.json(
        { message: 'Error deleting member' },
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