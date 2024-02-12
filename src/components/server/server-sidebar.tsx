import { platform } from 'os';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/user';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { channelIcons, roleIcons } from '@/components/icons';
import db from '@/lib/db';
import ServerHeader from './server-header';
import ServerSearch from './server-search';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

export default async function ServerSidebar({ serverId }: { serverId: string }) {
  const user = await getProfile();

  const isMac = platform() === 'darwin';

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  const textChannels = server?.channels.filter(channel => channel.type === 'TEXT');
  const auidoChannels = server?.channels.filter(channel => channel.type === 'AUDIO');
  const videoChannels = server?.channels.filter(channel => channel.type === 'VIDEO');
  const members = server?.members?.filter(member => member.userId !== user?.id);
  const role = server?.members?.find(member => member.userId === user?.id)?.role;

  if(!server) return redirect('/');

  return (
    <nav className="flex flex-col w-full h-full text-primary bg-[#2B2D31]">
      <ServerHeader
        server={server}
        role={role ?? 'GUEST'}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            isMac={isMac}
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons.TEXT
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: auidoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons.AUDIO
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcons.AUDIO
                }))
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.user.name,
                  icon: roleIcons[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className="bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType="TEXT"
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels?.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!auidoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType="AUDIO"
              role={role}
              label="Audio Channels"
            />
            <div className="space-y-[2px]">
              {auidoChannels?.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType="VIDEO"
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels?.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
            />
            <div className="space-y-[2px]">
              {members?.map(member => (
                <ServerMember 
                  key={member.id} 
                  member={member}
                  server={server} 
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </nav>
  );
}
