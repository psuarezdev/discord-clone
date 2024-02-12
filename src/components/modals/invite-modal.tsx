'use client';

import { useState } from 'react';
import { useOrigin } from '@/hooks/use-origin';
import { useModalStore } from '@/hooks/use-modal-store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function IniviteModal() {
  const { type, isOpen, onOpen, onClose, data } = useModalStore();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;
  const isModalOpen = isOpen && type === 'invite';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleNewLink = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/servers/${data?.server?.id}/invite-code`, {
        method: 'PATCH'
      });

      onOpen('invite', { server: await res.json() });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#3f4045] text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-zinc font-bold">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-300/80">
            Get your friends to join your server by sending them an invite link.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-cs font-bold text-white/70">
            Server invite link
          </Label>
          <div className="flex items-center gap-x-2 mt-2">
            <Input
              className="bg-zinc-500/50 border-0 placeholder:text-white text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button
              className="text-white/70 bg-indigo-500 hover:bg-indigo-600"
              size="icon"
              onClick={handleCopy}
              disabled={copied || isLoading}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            className="text-xs text-white/70 mt-4"
            variant="link"
            size="sm"
            onClick={handleNewLink}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
