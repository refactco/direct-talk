import { cn } from '@/lib/utils';
import { Plus, User } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface RequestAuthorCardProps {
  isLoading?: boolean;
  onClick?: () => void;
}

export function RequestAuthorCard({
  isLoading = false,
  onClick
}: RequestAuthorCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isLoading && onClick) {
      onClick();
    }
  };

  // Request Author card should always be clickable
  const isDisabled = false;

  if (isLoading) {
    return (
      <div className="relative w-full p-2 md:p-4 rounded-lg flex flex-col items-center">
        <div className="relative bg-background rounded-full w-full max-w-[125px] aspect-square overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
        </div>
        <div className="w-full pt-1 md:pt-2">
          <Skeleton className="h-4 md:h-5 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full transition-all duration-300 group/request cursor-pointer hover:bg-accent p-2 md:p-4 rounded-lg flex flex-col items-center border-2 border-dashed border-muted-foreground/30 hover:border-primary/50',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-muted/50 rounded-full w-full max-w-[125px] aspect-square overflow-hidden flex items-center justify-center transition-all duration-300 group-hover/request:bg-muted">
        <div className="relative flex items-center justify-center">
          <User
            className={cn(
              'w-8 h-8 text-muted-foreground/60 transition-all duration-300',
              isHovered && 'scale-90'
            )}
          />
          <Plus
            className={cn(
              'w-4 h-4 text-primary absolute -bottom-1 -right-1 transition-all duration-300',
              isHovered && 'scale-110'
            )}
          />
        </div>
      </div>
      <div className="w-full pt-1 md:pt-2">
        <h3 className="text-xs md:text-sm font-bold text-center text-muted-foreground transition-colors duration-300 group-hover/request:text-primary">
          Request Author
        </h3>
      </div>
    </div>
  );
}
