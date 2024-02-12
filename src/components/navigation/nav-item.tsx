'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ActionTooltip from '@/components/action-tooltip';
import { cn } from '@/lib/utils';

interface NavItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export default function NavItem({ id, name, imageUrl }: NavItemProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <button 
        className="group relative flex items-center "
        type="button" 
        onClick={() => router.push(`/servers/${id}`)}
      >
        <div 
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'w-0 group-hover:w-[4px] group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )} 
        />
        <div className={cn(
          'group relative flex mx-3 w-[48px] h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
          params?.serverId === id && 'bg-primary-/10 text-primary rounded-[16px]'
        )}>
          <Image 
            fill
            src={imageUrl}
            alt="Channel"
          />
        </div>
      </button>
    </ActionTooltip>
  );
}
