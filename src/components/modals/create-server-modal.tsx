'use client';

import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';

export default function CreateServerModal() {
  const { type, isOpen, onClose } = useModalStore();
  const router = useRouter();
  const form = useForm();

  const isModalOpen = isOpen && type === 'createServer';

  const isLoading = form.formState.isSubmitting;
  const errors = form.formState.errors;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('file', data.image[0]);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });

      if(!res.ok) return;
      
      const uploadData = await res.json();
      
      await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          image: uploadData
        })
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

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#3f4045] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-300/80">
            Get yor server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <FileUpload
                name="image"
                required
                register={form.register}
              />
              {errors.image && <span className="text-sm">{errors.image.message as string}</span>}
            </div>
            <div>
              <label htmlFor="name" className="text-sm">Server Name</label>
              <Input
                className="text-white placeholder:text-white bg-zinc-500/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
                placeholder="Enter server name..."
                {...form.register('name', {
                  required: 'Server name is required'
                })}
              />
              {errors.name && <span className="text-sm">{errors.name.message as string}</span>}
            </div>
          </div>
          <DialogFooter className="bg-[#4e4e52] px-6 py-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
