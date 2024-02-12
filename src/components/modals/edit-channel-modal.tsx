'use client';

import { Controller, useForm } from 'react-hook-form';
import { ChannelType } from '@prisma/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import { useEffect } from 'react';

export default function EditChannelModal() {
  const { type, isOpen, onClose, data } = useModalStore();
  const router = useRouter();
  const form = useForm();

  const { server, channel } = data;

  const isModalOpen = isOpen && type === 'editChannel';

  const isLoading = form.formState.isSubmitting;
  const errors = form.formState.errors;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await fetch(`/api/servers/${server?.id}/channels/${channel?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      form.reset();
      router.refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  });

  const handleClose = () => {
    form.reset();
    router.refresh();
    onClose();
  };

  useEffect(() => {
    if(channel) {
      form.setValue('name', channel.name);
      form.setValue('type', channel.type);
    }
  }, [channel, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#3f4045] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <label htmlFor="name" className="text-sm">Channel Name</label>
              <Input
                className="text-white bg-zinc-500/50 border-0 placeholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                placeholder="Enter channel name..."
                {...form.register('name', {
                  required: 'Channel name is required',
                  validate: value => value !== 'general' || 'name cannot be "general"'
                })}
              />
              {errors.name && <span className="text-sm">{errors.name.message as string}</span>}
            </div>
            <div>
              <label htmlFor="type" className="text-sm">Channel Type</label>
              <Controller
                control={form.control}
                name="type"
                disabled={isLoading}
                rules={
                  {
                    required: 'Channel type is required',
                    validate: (value: ChannelType) => ChannelType[value] || 'Invalid channel type'
                  }
                }
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    disabled={field.disabled}
                  >
                    <SelectTrigger className="text-white bg-zinc-500/50 border-0 focus:ring-0 focus:ring-offset-0 capitalize outline-none">
                      <SelectValue
                        placeholder="Select channel type"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-500/50 text-white">
                      {Object.values(ChannelType).map(type => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter className="bg-[#4e4e52] px-6 py-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
