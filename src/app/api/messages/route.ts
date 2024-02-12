import { type NextRequest, NextResponse } from 'next/server';
import type { Message } from '@prisma/client';
import { getProfile } from '@/lib/user';
import db from '@/lib/db';


const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const authUser = await getProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');

    if (!authUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
  
    if (!channelId) {
      return NextResponse.json(
        { message: 'Missing channelId' },
        { status: 404 }
      );
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: {
                select: {
                  id: true,
  name: true,  
                  email: true,
                  avatar: true
                }
              },
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        }
      })
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              user: {
                select: {
                  id: true,
  name: true,  
                  email: true,
                  avatar: true
                }
              },
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}