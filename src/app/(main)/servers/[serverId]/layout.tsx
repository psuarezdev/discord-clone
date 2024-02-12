import { redirect } from 'next/navigation';
import db from '@/lib/db';
import ServerSidebar from '@/components/server/server-sidebar';
import { getProfile } from '@/lib/user';

interface ServerLayoutProps {
  children: React.ReactNode;
  params: { serverId: string; };
}

export default async function ServerLayout({ children, params }: ServerLayoutProps) {
  const user = await getProfile();

  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user?.id
        }
      }
    }
  });

  if (!server) return redirect('/');

  return (
    <div className="h-full">
      <aside className="hidden md:flex flex-col w-60 h-full fixed z-20 inset-y-0">
        <ServerSidebar serverId={server.id} />
      </aside>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
}