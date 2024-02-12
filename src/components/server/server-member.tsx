'use client';

import type { Server } from '@/types.d';
import type { Member, User } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { roleIcons } from '@/components/icons';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user-avatar';

interface ServerMemberProps {
  member: Member & { user: User };
  server: Server;
}

export default function ServerMember({ member, server }: ServerMemberProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <button 
      type="button"
      className={cn(
        'group flex items-center gap-x-2 w-full mb-1 px-2 py-2 rounded-md hover:bg-zinc-700/50 transition',
        params?.memberId === member.id && 'bg-zinc-700'
      )}
      onClick={() => router.push(`/servers/${server.id}/conversations/${member.id}`)}
    >
      <UserAvatar 
        className="w-8 h-8 md:w-8 md:h-8"
        src={member.user.avatar}
        alt={`${member.user.name}'s avatar`}
      />
      <p className={cn(
        'text-sm font-semibold text-zinc-400 group-hover:text-zinc-300 transition flex items-center justify-between w-full',
        params?.memberId === member.id && 'text-zinc-200 group-hover:text-white'
      )}>
        {member.user.name}
        {roleIcons[member.role]}
      </p>
    </button>
  );
}
