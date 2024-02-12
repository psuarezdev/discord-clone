'use client';

import { Plus } from 'lucide-react';
import ActionTooltip from '@/components/action-tooltip';
import { useModalStore } from '@/hooks/use-modal-store';

export default function NavAction() {
  const { onOpen } = useModalStore();

  return (
    <header>
      <ActionTooltip
        side="right"
        align="center"
        label="Add a server"
      >
        <button className="flex items-center group" type="button" onClick={() => onOpen('createServer')}>
          <div className="flex items-center justify-center bg-neutral-700 mx-3 w-[48px] h-[48px] rounded-[24px] group-hover:rounded-[16px] group-hover:bg-emerald-500 transition-all overflow-hidden">
            <Plus 
              className="group-hover:text-white transition text-emerald-500" 
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </header>
  );
}
