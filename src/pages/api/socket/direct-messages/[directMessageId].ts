import type { NextApiRequest } from 'next';
import type { NextApiResponseServerIo } from '@/types.d'
import { getProfilePages } from '@/lib/user';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  try {
    if (req.method !== 'PATCH' && req.method !== 'DELETE') {
      return res.status(405).json({
        message: 'Method not allowed'
      });
    }

    const { directMessageId } = req.query;
    const { content, conversationId } = req.body;

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

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId
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

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    const isMessageOwner = directMessage.member.userId === authUser.id;
    const isAdministrator = member.role === 'ADMIN';
    const isModerator = member.role === 'MODERATOR';

    if(!isMessageOwner && !isAdministrator && !isModerator) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if(req.method === 'DELETE') {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: {
          fileUrl: null,
          fileId: null,
          content: 'This message has been deleted.',
          deleted: true
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
    }

    if(req.method === 'PATCH') {
      if(!content) {
        return res.status(400).json({
          message: 'Missing content field'
        });
      }

      if(!isMessageOwner) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: { content },
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
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (err) {
    return res.status(500).json(
      { message: 'Something went wrong' }
    );
  }
}