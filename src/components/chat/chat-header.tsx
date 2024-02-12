import { Hash } from 'lucide-react';
import MobileToogle from '@/components/mobile-toogle';
import UserAvatar from '@/components/user-avatar';
import SocketIndicator from '@/components/socket-indicator';
import ChatVideoButton from './chat-video-button';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

export default function ChatHeader({ serverId, name, type, imageUrl }: ChatHeaderProps) {
  return (
    <div className="flex items-center h-12 px-3 text-md font-semibold border-neutral-800 border-b-2">
      <MobileToogle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-400 mr-2" />
      )}
      {type === 'conversation' && (
        <UserAvatar
          className="w-8 h-8 md:w-8 md:h-8 mr-2"
          src={imageUrl}
          alt={`${name}'s avatar`}
        />
      )}
      <p className="font-semibold text-md text-white">
        {name}
      </p>
      <div className="flex items-center ml-auto">
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
}
