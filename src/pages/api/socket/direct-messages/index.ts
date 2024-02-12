import type { NextApiRequest } from 'next';
import type { NextApiResponseServerIo } from '@/types.d'
import { getProfilePages } from '@/lib/user';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        message: 'Method not allowed'
      });
    }

    const { conversationId, content, file } = req.body;

    const authUser = await getProfilePages(req);

    if (!authUser) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        message: 'Missing id'
      });
    }

    if (!content && !file) {
      return res.status(400).json({
        message: 'Content or file is required'
      });
    }

    if (file && (!file.id || !file.url)) {
      return res.status(400).json({
        message: 'Invalid file'
      });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
        OR: [
          { 
            memberOne: {
              userId: authUser.id
            } 
          },
          { 
            memberTwo: {
              userId: authUser.id
            } 
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        memberTwo: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found'
      });
    }

    const member = conversation.memberOne.userId === authUser.id ? conversation.memberOne : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({
        message: 'Member not found'
      });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileId: file?.id,
        fileUrl: file?.url,
        conversationId,
        memberId: member.id
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
            }
          }
        }
      }
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(201).json(message);
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
}