import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/user';
import { getOrCreateConversation } from '@/lib/conversation';
import db from '@/lib/db';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages';
import ChatInput from '@/components/chat/chat-input';
import MediaRoom from '@/components/media-room';

interface ConversationParams {
  params: {
    serverId: string;
    memberId: string
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function Conversation({ params, searchParams }: ConversationParams) {
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: (await getProfile())?.id
    },
    include: {
      user: true
    }
  });

  if (!currentMember) return redirect('/');

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col h-full bg-[#313338]">
      <ChatHeader
        type="conversation"
        name={otherMember.user.name}
        imageUrl={otherMember.user.avatar ?? '/default-avatar.jpg'}
        serverId={params.serverId}
      />
      {searchParams.video && (
        <MediaRoom 
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.user.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketBody={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.user.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            Ids={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
}
