import db from '@/lib/db';
import { getProfile } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function Server({ params }: { params: { serverId: string } }) {
  const user = await getProfile();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user?.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });
  
  const initialChannel = server?.channels[0];

  if(initialChannel?.name !== 'general') return null;

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}
