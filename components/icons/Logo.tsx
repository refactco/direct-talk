import { cn } from '@/lib/utils';

export function Logo(props: any) {
  return (
    <div
      {...props}
      className={cn(
        'w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold',
        props.className
      )}
      style={{ backgroundColor: '#97c521' }}
    ></div>
    // <BotMessageSquareIcon {...props} />
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="25"
    //   height="26"
    //   viewBox="0 0 25 26"
    //   fill="none"
    //   {...props}
    // >
    //   <path
    //     opacity="0.2"
    //     d="M12.5 10L25 18L12.5 26L0 18L12.5 10Z"
    //     fill="currentColor"
    //   ></path>
    //   <path
    //     opacity="0.5"
    //     d="M12.5 5L25 13L12.5 21L0 13L12.5 5Z"
    //     fill="currentColor"
    //   ></path>
    //   <path d="M12.5 0L25 8L12.5 16L0 8L12.5 0Z" fill="currentColor"></path>
    // </svg>
  );
}
