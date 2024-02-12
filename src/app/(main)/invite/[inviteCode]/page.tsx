import db from '@/lib/db';
import { getProfile } from '@/lib/user';
import { redirect } from 'next/navigation';

export default async function Invite({ params }: { params: { inviteCode: string; }; }) {
  const user = await getProfile();

  const serverExists = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: user?.id
        }
      }
    }
  }); 

  if(serverExists) return redirect(`/servers/${serverExists.id}`);
  
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode
    },
    data: {
      members: {
        create: [
          { userId: user?.id! }
        ]
      }
    }
  });

  if(server) return redirect(`/servers/${server.id}`);

  return redirect('/');
}
