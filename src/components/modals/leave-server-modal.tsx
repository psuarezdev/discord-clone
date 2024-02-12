'use client';

import { useModalStore } from '@/hooks/use-modal-store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LeaveServerModal() {
  const router = useRouter();
  const { type, isOpen, onClose, data } = useModalStore();
  const [isLeaving, setIsLeaving] = useState(false);
  const isModalOpen = isOpen && type === 'leaveServer';

  const { server } = data;

  const handleLeaveServer = async() => {
    try {
      setIsLeaving(true);

      await fetch(`/api/servers/${server?.id}/leave`, {
        method: 'PATCH'
      });

      onClose();
      router.refresh();
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#3f4045] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-300/80">
            Are you sure you want to leave <span className="text-indigo-500">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-[#4e4e52] px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="primary" onClick={onClose} disabled={isLeaving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLeaveServer} disabled={isLeaving}>
              Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
