'use client';

import type { Channel, MemberRole } from '@prisma/client';
import type { Server } from '@/types.d';
import { useParams, useRouter } from 'next/navigation';
import { channelIcons } from '@/components/icons';
import { cn } from '@/lib/utils';
import ActionTooltip from '@/components/action-tooltip';
import { Edit, Lock, Trash } from 'lucide-react';
import { type ModalType, useModalStore } from '@/hooks/use-modal-store';

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
  role?: MemberRole
}

export default function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModalStore();

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      type="button"
      className={cn(
        'group flex items-center w-full mb-1 px-2 py-2 rounded-md hover:bg-zinc-700/50 transition',
        params?.channelId === channel.id && 'bg-zinc-700'
      )}
      onClick={() => router.push(`/servers/${params?.serverId}/channels/${channel?.id}`)}
    >
      {channelIcons[channel.type]}
      <p className={cn(
        'line-clamp-1 text-sm font-semibold text-zinc-400 hover:text-zinc-300 transition',
        params?.channelId === channel.id && 'text-zinc-200 group-hover:text-white'
      )}>
        <ActionTooltip label={channel.name} className="max-w-[175px]">
          <span>{channel.name.length > 17 ? `${channel.name.slice(0, 17)}...` : channel.name}</span>
        </ActionTooltip>
      </p>
      {channel.name !== 'general' && role !== 'GUEST' && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden w-4 h-4 text-zinc-400 group-hover:block hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, 'editChannel')}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="hidden w-4 h-4 text-zinc-400 group-hover:block hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, 'deleteChannel')}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <ActionTooltip label="Lock">
          <Lock className="ml-auto w-4 h-4 text-zinc-400 group-hover:block group-hover:text-zinc-300 transition" />
        </ActionTooltip>
      )}
    </button>
  );
}
