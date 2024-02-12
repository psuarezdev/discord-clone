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

    const { messageId } = req.query;
    const { content, serverId, channelId } = req.body;

    const authUser = await getProfilePages(req);

    if (!authUser) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!messageId || !serverId || !channelId) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            userId: authUser.id
          }
        }
      },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({
        message: 'Server not found'
      });
    }

    const channel = db.channel.findFirst({
      where: {
        id: channelId,
        serverId
      }
    });

    if (!channel) {
      return res.status(404).json({
        message: 'Channel not found'
      });
    }

    const member = server.members.find(member => member.userId === authUser.id);

    if (!member) {
      return res.status(404).json({
        message: 'Member not found'
      });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId
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

    if (!message || message.deleted) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    const isMessageOwner = message.member.userId === authUser.id;
    const isAdministrator = member.role === 'ADMIN';
    const isModerator = member.role === 'MODERATOR';

    if(!isMessageOwner && !isAdministrator && !isModerator) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if(req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string
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

      message = await db.message.update({
        where: {
          id: messageId as string
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

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    return res.status(500).json(
      { message: 'Something went wrong' }
    );
  }
}