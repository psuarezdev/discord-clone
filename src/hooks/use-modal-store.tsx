import type { Channel, ChannelType } from '@prisma/client';
import type { Server } from '@/types.d';
import { create } from 'zustand';

export type ModalType = 'createServer' | 'editServer' | 'invite' | 'members' | 'createChannel' | 'leaveServer' | 'deleteServer' | 'deleteChannel' | 'editChannel' | 'messageFile' | 'deleteMessage';

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  Ids?: Record<string, any>;
}

export interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
