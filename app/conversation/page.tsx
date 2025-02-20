'use client';

import { ChatData, Message } from '@/app/conversation/types';
import { ChatInput } from '@/components/ChatInput';
import { Logo } from '@/components/icons/Logo';
import { ResourcesList } from '@/components/resources-list/resources-list';
import { SearchModal } from '@/components/search-modal/search-modal';
import TextLoading from '@/components/TextLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useResource } from '@/contexts/ResourcesContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'; // Add Suspense
import ReactMarkdown from 'react-markdown';
import { Icons } from '@/components/icons';
import SelectedResourceCard from '@/components/SelectedResourceCard';

export default function ChatConversationPage() {
  const { selectedResources, removeResource } = useSelectedResources();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false);
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const { openAuthModal, isAuthenticated } = useAuth();
  const { fetchChat, chatDatas, addMessage, doChat, isLoadingChats } =
    useChat();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { resources, fetchResource } = useResource();

  const scrollToLastMessage = () => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  };
  useEffect(() => {
    setChatData(chatDatas);
    scrollToLastMessage();
    const contentIds = chatData?.content_ids;
    // const contentIds = [11];
    if (contentIds?.length) {
      fetchResource(contentIds);
    }
  }, [chatDatas]);

  useEffect(() => {
    if (chatId) {
      fetchChat(chatId).catch((err) => {
        if (!isAuthenticated && err.status === 401) {
          openAuthModal();
        }
      });
    }
  }, [chatId]);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      addMessage({ question: message });
      scrollToLastMessage();
      const result = await doChat(message, undefined, chatId?.toString());
      addMessage({ answer: result?.answer });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage(
        `Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingChats) {
    return <Icons.spinner className="m-auto mt-[6%] h-4 w-4 animate-spin" />;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto min-h-[calc(100vh-10rem)]">
        <div className="max-w-[732px] mx-auto pr-0 md:pr-12">
          {Object.keys(resources).length > 0 && chatData?.chat_history && (
            <div className="mt-6 flex flex-col gap-[14px] max-w-max">
              <p className="text-sm font-bold">Resources</p>
              {chatData?.content_ids?.map((id) => (
                <SelectedResourceCard
                  key={id}
                  hideRemove
                  resource={resources[id]}
                />
                // <SelectedResourceCard key={id} hideRemove resource={resources[id]} />
              ))}
            </div>
          )}
          <div className="mb-6 py-6">
            {chatData?.chat_history?.map((message: Message, index: number) => (
              <div
                key={index}
                className={`p-3 md:p-4 rounded-lg ${
                  message.question
                    ? 'bg-background-secondary mt-16 md:mt-10'
                    : 'bg-background-highlight'
                }`}
              >
                <div className="flex flex-col items-start gap-[14px]">
                  {message.answer && <Logo />}
                  <div className="flex-1">
                    <p
                      className={`text-foreground ${
                        message.question ? 'text-lg font-bold' : 'text-base'
                      }`}
                    >
                      <ReactMarkdown>
                        {message.answer || message.question}
                      </ReactMarkdown>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && <TextLoading />}
            {errorMessage && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errorMessage}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      {/* Empty div for scrolling to bottom */}
      <div className="sticky bottom-0 w-full">
        <div className="h-10 w-full bg-fade"></div>
        <div className="max-w-[732px] mx-auto px-4 bg-background pb-3 md:pb-12">
          <ChatInput
            onSubmit={handleSubmit}
            onAddResource={() => setIsResourceSelectorOpen(true)}
            hideResources
            isLoading={isLoading}
            placeholder="Ask follow-up..."
            resetAfterSubmit
          />
        </div>
      </div>
      <SearchModal
        open={isResourceSelectorOpen}
        onOpenChange={setIsResourceSelectorOpen}
      />
    </div>
  );
}
