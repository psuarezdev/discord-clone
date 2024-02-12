'use client';

import { Server } from '@/types.d';
import type { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import { useModalStore } from '@/hooks/use-modal-store';
import ActionTooltip from '@/components/action-tooltip';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channel' | 'members';
  channelType?: ChannelType;
  server?: Server;
}

export default function ServerSection({ label, role, sectionType, channelType, server }: ServerSectionProps) {
  const { onOpen } = useModalStore();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-400">
        {label}
      </p>
      {role !== 'GUEST' && sectionType === 'channel' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-300 transition"
            onClick={() => onOpen('createChannel', { channelType })}
          >
            <Plus className="w-4 h-4 text-zinc-400" />
          </button>
        </ActionTooltip>
      )}
      {role === 'ADMIN' && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-300 transition"
            onClick={() => onOpen('members', { server })}
          >
            <Settings className="w-4 h-4 text-zinc-400" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
