import { ConversationPageLoading } from '@/components/conversation-page-loading/conversation-page-loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Conversation',
  description:
    'Engage in AI-powered conversations with your favorite thinkers and authors. Ask questions and explore ideas through interactive chat.',
  openGraph: {
    title: 'Conversation | Ask Author',
    description:
      'Engage in AI-powered conversations with your favorite thinkers and authors.',
    type: 'website'
  },
  twitter: {
    title: 'Conversation | Ask Author',
    description:
      'Engage in AI-powered conversations with your favorite thinkers and authors.'
  },
  robots: {
    index: false, // Don't index individual conversation pages for privacy
    follow: true
  }
};

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
