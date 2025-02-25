import { ConversationPageLoading } from '@/components/conversation-page-loading/conversation-page-loading';
import { Suspense } from 'react';

export default function ChatLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<ConversationPageLoading />}>{children}</Suspense>;
}
