import db from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavAction from '@/components/navigation/nav-action';
import NavItem from '@/components/navigation/nav-item';
import { getProfile } from '@/lib/user';
import { UserButton } from '@clerk/nextjs';

export default async function NavSideBar() {
  const user = await getProfile();

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: user?.id
        }
      }
    }
  });

  return (
    <nav className="flex flex-col items-center w-full h-full space-y-4 text-primary bg-[#1E1F22] py-3">
      <NavAction />
      <Separator
        className="w-10 h-[2px] mx-auto bg-zinc-700 rounded-md"
      />
      <ScrollArea className="flex-1 w-full">
        {servers && servers.map(({ id, name, imageUrl }) => (
          <div key={id} className="mb-4">
            <NavItem
              id={id}
              name={name}
              imageUrl={imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <footer className="flex flex-col items-center gap-y-4 mt-auto pb-3">
        <UserButton 
          afterSignOutUrl="/"
        />
      </footer>
    </nav>
  );
}
