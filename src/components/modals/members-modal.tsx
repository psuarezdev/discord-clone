'use client';

import type { Member, MemberRole, User } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Gavel, Loader2, MoreVertical, ShieldQuestion } from 'lucide-react';
import { useModalStore } from '@/hooks/use-modal-store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '@/components/user-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { roleIcons } from '@/components/icons'; 

export default function MembersModal() {
  const router = useRouter();
  const { type, isOpen, onOpen, onClose, data } = useModalStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const isModalOpen = isOpen && type === 'members';
  const { server } = data;

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const res = await fetch(`/api/servers/${server?.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });


      const serverData = await res.json();

      router.refresh();
      onOpen('members', { server: serverData });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const res = await fetch(`/api/servers/${server?.id}/members/${memberId}`, {
        method: 'DELETE'
      });

      const serverData = await res.json();

      router.refresh();
      onOpen('members', { server: serverData });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#3f4045] text-white overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-300/80">
            {server?.members.length} {server?.members.length === 1 ? 'Member' : 'Members'}
          </DialogDescription>
        </DialogHeader>
        <Separator className="mt-4 bg-zinc-500/50" />
        <ScrollArea className="max-h-[420px] mt-8 pr-6">
          {server?.members && server?.members.map((member: Member & { user: User }) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar
                src={member.user.avatar}
              />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-sm font-semibold">
                  {member.user.name}
                  {roleIcons[member.role]}
                </div>
                <p className="text-xs text-zinc-300/70">{member.user.email}</p>
              </div>
              {server.userId !== member.user.id && loadingId !== member.user.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4 text-zinc-300/80" />
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'GUEST')}>
                                {roleIcons.GUEST} Guest
                                {member.role === 'GUEST' && <Check className="w-4 h-4 ml-auto" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'MODERATOR')}>
                                {roleIcons.MODERATOR} Moderator
                                {member.role === 'MODERATOR' && <Check className="w-4 h-4 ml-auto" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'ADMIN')}>
                                {roleIcons.ADMIN} Admin
                                {member.role === 'ADMIN' && <Check className="w-4 h-4 ml-auto" />}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-500" onClick={() => handleKick(member.id)}>
                          <Gavel className="w-4 h-4 mr-2" /> Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.user.id && (
                <Loader2 className="w-4 h-4 ml-auto animate-spin" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
