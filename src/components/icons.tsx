import type { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from 'lucide-react';

export const roleIcons: Record<MemberRole, JSX.Element> = {
  GUEST: <User className="w-4 h-4 mr-2 text-zinc-300/70" />,
  MODERATOR: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

export const channelIcons: Record<ChannelType, JSX.Element> = {
  TEXT: <Hash className="w-4 h-4 mr-2" />,
  AUDIO: <Mic className="w-4 h-4 mr-2" />,
  VIDEO: <Video className="w-4 h-4 mr-2" />
};
