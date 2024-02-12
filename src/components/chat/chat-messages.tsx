'use client';

import { Fragment, useRef, type ElementRef } from 'react';
import type { Member } from '@prisma/client';
import type { Message } from '@/types.d';
import { format } from 'date-fns';
import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatWelcome from './chat-welcome';
import ChatItem from './chat-item';

const DATE_FORMAT = 'd MMM yyyy HH:mm';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketBody: Record<string, any>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

export default function ChatMessages({ name, member, chatId, apiUrl, socketUrl, socketBody, paramKey, paramValue, type }: ChatMessagesProps) {
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const queryKey = `chat:${chatId}`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });
  useChatSocket({ addKey, updateKey, queryKey });
  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    loadMore: fetchNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0
  });

  if (status === 'pending') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="mb-1" />
        <p className="text-xs text-zinc-400">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col py-4 overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome
            type={type}
            name={name}
          />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              type="button"
              className="text-xs text-zinc-400 hover:text-zinc-300 my-4 transition"
              onClick={() => fetchNextPage()}
            >
              Load more...
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group?.items?.map((message: Message) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileUrl={message.fileUrl}
                fileId={message.fileId}
                deleted={message.deleted}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketBody={socketBody}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
