'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useModalStore } from '@/hooks/use-modal-store';
import EmojiPicker from '@/components/emoji-picker';

interface ChatInputProps {
  apiUrl: string;
  Ids: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel';
}

export default function ChatInput({ apiUrl, Ids, name, type }: ChatInputProps) {
  const { onOpen } = useModalStore();
  const router = useRouter();
  const form = useForm();

  const onSubmit = form.handleSubmit(async (formData) => {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Ids,
          content: formData.content
        })
      });

      form.reset();
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="relative p-4 pb-6">
          <button
            type="button"
            onClick={() => onOpen('messageFile', { apiUrl, Ids })}
            className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-400 hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
          >
            <Plus className="text-[#313338]" />
          </button>
          <Input
            className="px-14 py-6 bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
            placeholder={`Message ${type === 'conversation' ? name : `#${name}`}`}
            disabled={form.formState.isSubmitting}
            {...form.register('content', {
              required: true,
              minLength: 1
            })}
          />
          <div className="absolute top-7 right-8">
            <EmojiPicker 
              onChange={emoji => form.setValue('content', form.getValues('content') + emoji)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
