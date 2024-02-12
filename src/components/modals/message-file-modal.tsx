'use client';

import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import FileUpload from '@/components/file-upload';

export default function MessageFileModal() {
  const { isOpen, onClose, type, data: { apiUrl, Ids } } = useModalStore();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'messageFile';

  const form = useForm();

  const isLoading = form.formState.isSubmitting;
  const errors = form.formState.errors;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file?.[0]);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });

      if(!res.ok) return;

      const file = await res.json();

      await fetch(apiUrl ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Ids,
          file
        })
      });

      form.reset();
      router.refresh();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#3f4045] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-300/80">
            Send a file as a message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <FileUpload
                name="file"
                required
                register={form.register}
              />
              {errors.file && <span className="text-sm">{errors.file.message as string}</span>}
            </div>
          </div>
          <DialogFooter className="bg-[#4e4e52] px-6 py-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
