import { redirect } from 'next/navigation';
import { initialProfile } from '@/lib/user';
import db from '@/lib/db';
import InitialModal from '@/components/modals/initial-modal';

export default async function Home() {
  const user = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: user?.id
        }
      }
    }
  });
  
  if(server) return redirect(`/servers/${server.id}`);

  return <InitialModal />;
}
