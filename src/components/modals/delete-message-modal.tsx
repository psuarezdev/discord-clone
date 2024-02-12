'use client';

import { useState } from 'react';
import { useModalStore } from '@/hooks/use-modal-store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeleteMessageModal() {
  const { type, isOpen, onClose, data } = useModalStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const isModalOpen = isOpen && type === 'deleteMessage';

  const { apiUrl, Ids } = data;

  const handleDeleteChannel = async() => {
    try {
      setIsDeleting(true);

      await fetch(apiUrl ?? '', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Ids)
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#3f4045] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-300/80">
            Are you sure you want to do this? <br />
            There message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-[#4e4e52] px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="primary" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteChannel} disabled={isDeleting}>
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
