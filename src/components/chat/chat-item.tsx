'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useModalStore } from '@/hooks/use-modal-store';
import type { Member, User } from '@prisma/client';
import { roleIcons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';
import ActionTooltip from '@/components/action-tooltip';
import Image from 'next/image';

interface ChatItemProps {
  id: string;
  content: string | null;
  member: Member & { user: User };
  timestamp: string;
  fileUrl: string | null;
  fileId: string | null;
  currentMember: Member;
  deleted: boolean;
  isUpdated: boolean;
  socketUrl: string;
  socketBody: Record<string, string>;
}

export default function ChatItem({ id, content, member, timestamp, fileUrl, fileId, currentMember, deleted, isUpdated, socketUrl, socketBody }: ChatItemProps) {
  const { onOpen } = useModalStore();
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({ defaultValues: { content } });
  const isSubmitting = form.formState.isSubmitting;

  const isAdmin = currentMember.role === 'ADMIN';
  const isModerator = currentMember.role === 'MODERATOR';
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && (!fileUrl && !fileId);

  const onMemberClick = () => {
    if(member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    try {
      await fetch(`${socketUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...socketBody,
          content: formData.content
        })
      });

      form.reset();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Escape') setIsEditing(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({ content });
  }, [form, content]);

  return (
    <div className="relative group flex items-center w-full p-4 transition hover:bg-black/5">
      <div className="group flex items-start gap-x-2 w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition" onClick={onMemberClick}>
          <UserAvatar
            src={member.user.avatar}
            alt={`${member.user.name}'s avatar`}
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-end gap-x-2">
            <div className="flex items-center gap-x-1">
              <p className="font-semibold text-sm hover:underline cursor-pointer" onClick={onMemberClick}>
                {member.user.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIcons[member.role]}
              </ActionTooltip>
              <span className="ml-[-10px] text-xs text-zinc-400">
                {timestamp}
              </span>
            </div>
          </div>
          {!content && fileUrl && fileId && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary w-48 h-48"
            >
              <Image
                className="object-cover"
                src={fileUrl}
                alt={fileUrl}
                fill
              />
            </a>
          )}
          {!fileUrl && !fileId && !isEditing && (
            <p className={cn(
              'text-sm text-zinc-300',
              deleted && 'italic text-zinc-400 text-xs mt-1'
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && !fileId && isEditing && (
            <>
              <form onSubmit={onSubmit} className="flex items-center w-full gap-x-2 pt-2">
                <div className="relative w-full">
                  <Input
                    disabled={isSubmitting}
                    type="text"
                    className="p-2 bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                    placeholder="Edit your message..."
                    {...form.register('content', {
                      required: true,
                      minLength: 1,
                    })}
                  />
                </div>
                <Button size="sm" variant="primary" disabled={isSubmitting}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press <kbd>ESC</kbd> to cancel, <kbd>Enter</kbd> to save
              </span>
            </>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen('deleteMessage', { 
                apiUrl: `${socketUrl}/${id}`, 
                Ids: socketBody
              })}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
