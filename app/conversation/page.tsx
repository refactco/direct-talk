'use client';

import { ChatData } from '@/app/conversation/types';
import { ChatInput } from '@/components/ChatInput';
import { Icons } from '@/components/icons';
import { Logo } from '@/components/icons/Logo';
import { ResourcesList } from '@/components/resources-list/resources-list';
import TextLoading from '@/components/TextLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useResource } from '@/contexts/ResourcesContext';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'; // Add Suspense
import ReactMarkdown from 'react-markdown';
import { IChatHistory } from './types';

export default function ChatConversationPage() {
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
    console.log({ chatDatas });
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingChats) {
    return <Icons.spinner className="m-auto mt-[6%] h-4 w-4 animate-spin" />;
  }

  const chatHistory: IChatHistory[] = [];
  let history: any = {};

  chatData?.chat_history?.forEach((message: any) => {
    if (message.question) {
      history.question = message.question;
    } else if (message.answer) {
      history.answer = message.answer;

      chatHistory.push(history);
      history = {};
    }
  });

  return (
    <div className="flex gap-10 justify-center">
      <div className="fixed top-0 left-0 h-16 bg-fade-inverse z-[1] w-[calc(100vw-1rem)]"></div>
      <div className="relative flex flex-col h-[calc(100vh-3rem)] justify-between bg-background animate-in fade-in duration-500 pt-8">
        <div>
          <div className="w-[732px] mx-auto pr-0 md:pr-12">
            <div className="mb-6 px-3 md:px-4 flex flex-col">
              {chatHistory.map((message: IChatHistory, index: number) => {
                const { question, answer } = message;

                return (
                  <div key={index} className="rounded-lg">
                    <div className="flex flex-col items-start gap-[14px]">
                      <div>
                        <p className="text-foreground text-lg font-bold">
                          <ReactMarkdown>{question}</ReactMarkdown>
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <Logo />
                          <span className="text-sm">Answer</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground text-base">
                            <ReactMarkdown>{answer}</ReactMarkdown>
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < chatHistory.length - 1 ? (
                      <hr className="w-full my-6" />
                    ) : null}
                  </div>
                );
              })}
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
          <div className="max-w-[732px] mx-auto px-4 bg-background pb-3 md:pb-20">
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
      </div>
      <div className="w-44 mt-10">
        <div className="sticky top-10 left-0 flex flex-col gap-3">
          <p className="text-sm font-bold">Resources</p>
          <ResourcesList
            selectedResources={resources}
            hideRemoveButton
            direction="vertical"
            wrapTitle
          />
        </div>
      </div>
    </div>
  );
}
