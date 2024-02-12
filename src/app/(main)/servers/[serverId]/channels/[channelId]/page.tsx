import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/user';
import db from '@/lib/db';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import MediaRoom from '@/components/media-room';

export default async function Channel({ params }: { params: { serverId: string; channelId: string } }) {
  const { serverId, channelId } = params;

  const user = await getProfile();

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
      serverId
    }
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      userId: user?.id
    }
  });

  if (!channel || !member) return redirect(`/servers/${serverId}`);

  return (
    <div className="flex flex-col h-full bg-[#313338]">
      <ChatHeader
        type="channel"
        name={channel.name}
        serverId={serverId}
      />
      {channel.type === 'TEXT' && (
        <>
          <ChatMessages
            type="channel"
            paramKey="channelId"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            member={member}
            name={channel.name}
            chatId={channel.id}
            socketBody={{ serverId, channelId }}
            paramValue={channelId}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            Ids={{ serverId, channelId: channel.id }}
          />
        </>
      )}
      {channel.type === 'AUDIO' && (
        <MediaRoom 
          chatId={channel.id} 
          video={false} 
          audio={true} 
        />
      )}
      {channel.type === 'VIDEO' && (
        <MediaRoom 
          chatId={channel.id} 
          video={true} 
          audio={true}
        />
      )}
    </div>
  );
}
