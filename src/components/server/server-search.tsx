'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useRouter, useParams } from 'next/navigation';

interface ServerSearchProps {
  data: {
    label: string;
    type: 'channel' | 'member';
    data: {
      id: string;
      name: string;
      icon: JSX.Element;
    }[] | undefined;
  }[];
  isMac: boolean;
}

export default function ServerSearch({ data, isMac }: ServerSearchProps) {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const onClick = (id: string, type: 'channel' | 'member') => {
    setOpen(false);

    if (type === 'member') {
      return router.push(`/servers/${params?.serverId}/conversation/${id}`);
    }

    if (type === 'channel') {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, isMac]);

  return (
    <>
      <button
        type="button"
        className="group flex items-center gap-x-2 w-full px-2 py-2 rounded-md hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex items-center gap-1 h-5 ml-auto px-1.5 font-mono text-sm font-medium text-muted-foreground rounded border bg-muted select-none">
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for channels or members" />
        <CommandList>
          <CommandEmpty>
            <p className="text-muted-foreground text-sm">
              No results found
            </p>
          </CommandEmpty>
          {data.map(({ label, type, data }) => {
            if(!data || data.length === 0) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, name, icon }) => (
                  <CommandItem key={id} onClick={() => onClick(id, type)}>
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
