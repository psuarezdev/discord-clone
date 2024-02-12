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

    const { serverId, channelId, content, file } = req.body;

    const authUser = await getProfilePages(req);

    if (!authUser) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!serverId || !channelId) {
      return res.status(400).json({
        message: 'Missing Ids'
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

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            userId: authUser.id
          }
        }
      },
      include: { members: true }
    });

    if (!server) {
      return res.status(404).json({
        message: 'Server not found'
      });
    }

    const channel = await db.channel.findFirst({
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

    const message = await db.message.create({
      data: {
        content,
        fileId: file?.id,
        fileUrl: file?.url,
        channelId,
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

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(201).json(message);
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
}