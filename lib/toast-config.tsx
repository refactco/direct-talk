import Image from 'next/image';
import { ToastAction } from '@/components/ui/toast';
import type React from 'react';
interface toastConfigProps {
  image_url?: string;
  message: string;
  onAction?: () => void;
  action_text?: string;
  toastType?: 'normal' | 'destructive';
}
const toastConfig = (props: toastConfigProps) => {
  const {
    image_url,
    message,
    onAction,
    action_text,
    toastType = 'normal'
  } = props;
  return {
    variant: 'default',
    description: (
      <div className="flex align-center gap-2">
        {image_url ? (
          <Image
            width={24}
            height={24}
            src={image_url || '/placeholder.svg'}
            alt="Toast Image"
            style={{ marginRight: 8, borderRadius: '50%' }}
          />
        ) : null}
        {message}
      </div>
    ),
    action: (
      <>
        {onAction ? (
          <ToastAction
            className="bg-primary text-black border-none font-semibold text-xs rounded-[6px] hover:bg-primary/90"
            altText="Action"
            onClick={onAction}
          >
            {action_text}
          </ToastAction>
        ) : null}
      </>
    ),
    style: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      maxWidth: 'max-content',
      paddingRight: '34px',
      paddingLeft: image_url ? '16px' : '34px'
    },
    className: `p-4 bg-foreground border-none text-[13px] rounded-lg ${toastType === 'destructive' ? 'text-destructive' : 'text-black'}`
  };
};
export default toastConfig;
