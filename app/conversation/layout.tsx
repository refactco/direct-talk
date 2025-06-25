import { ConversationPageLoading } from '@/components/conversation-page-loading/conversation-page-loading';
import { Suspense } from 'react';

export default function ChatLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-32">
      <Suspense
        fallback={
          <div className="flex gap-8 min-h-[calc(100vh-154px)] max-w-3xl mx-auto">
            <ConversationPageLoading />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
