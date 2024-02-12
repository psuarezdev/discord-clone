import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  className?: string;
  src?: string | null;
  alt?: string;
}

export default function UserAvatar({ className, src, alt }: UserAvatarProps) {
  return (
    <Avatar className={cn('w-7 h-7 md:w-10 md:h-10', className)}>
      <AvatarImage src={src ?? '/default-avatar.jpg'} alt={alt ?? 'Avatar'} />
    </Avatar>
  );
}
