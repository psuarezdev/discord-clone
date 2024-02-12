'use client';

import type { MemberRole } from '@prisma/client';
import type { Server } from '@/types.d';
import { useModalStore } from '@/hooks/use-modal-store';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface ServerHeaderProps {
  server: Server;
  role: MemberRole
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModalStore();

  const isAdmin = role === 'ADMIN';
  const isModerator = isAdmin || role === 'MODERATOR';

  return (
    <header>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button
            className="flex items-center w-full h-12 text-md font-semibold px-3 border-neutral-800 border-b-2 hover:bg-zinc-700/50 text-white transition"
            type="button"
          >
            {server.name}
            <ChevronDown className="w-5 h-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-white/70 space-y-[2px] bg-zinc-700/50">
          {isModerator && (
            <DropdownMenuItem 
              className="text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/70"
              onClick={() => onOpen('invite', { server })}
            >
              Invite People
              <UserPlus className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem 
                className="px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/70"
                onClick={() => onOpen('editServer', { server })}
              >
                Server Settings
                <Settings className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/70"
                onClick={() => onOpen('members', { server })}
              >
                Manage Members
                <Users className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
            </>
          )}
          {isModerator && (
            <>
              <DropdownMenuItem 
                className="px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/70"
                onClick={() => onOpen('createChannel', { server })}
              >
                Create Channel
                <PlusCircle className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {isAdmin && (
            <DropdownMenuItem 
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/70"
              onClick={() => onOpen('deleteServer', { server })}
            >
              Delete Server
              <Trash className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem 
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/70"
              onClick={() => onOpen('leaveServer', { server })}  
            >
              Leave Server
              <LogOut className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
