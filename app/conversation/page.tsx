'use client';

import { ChatData, Message } from '@/app/chat/conversation/types';
import { ChatInput } from '@/components/ChatInput';
import { Logo } from '@/components/icons/Logo';
import { ResourcesList } from '@/components/resources-list/resources-list';
import TextLoading from '@/components/TextLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useResource } from '@/contexts/ResourcesContext';
import {useRouter, useSearchParams} from 'next/navigation';
import { useEffect, useRef, useState } from 'react'; // Add Suspense
import ReactMarkdown from 'react-markdown';
import {useHistory} from "@/contexts/HistoryContext";

export default function ChatConversationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false);
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const { openAuthModal, isAuthenticated } = useAuth();
  const { fetchChat, chatDatas, addMessage, doChat, startChatData, updateStartChatDate, resetChatData } =
    useChat();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasStartedChat = useRef(false);
  const { resources, fetchResource } = useResource();
  const { updateHistory } = useHistory();
  const router = useRouter();

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
    // const contentIds = chatData?.content_ids;
    const contentIds = [11];
    if (contentIds?.length) {
      fetchResource(contentIds);
    }
  }, [chatDatas]);

  const startNewChat = async () => {
    if (startChatData.message) {
      setIsLoading(true)
      addMessage({ question: startChatData.message });
      const chatData = await doChat(startChatData?.message, startChatData?.contentIds);
      router.push(`/conversation?id=${chatData.session_id}`);
      updateHistory();
      updateStartChatDate(null, null)
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (chatId) {
      resetChatData();
      updateStartChatDate(null, null);
      fetchChat(chatId).catch((err) => {
        if (!isAuthenticated && err.status === 401) {
          openAuthModal();
        }
      });
    } else if (!chatId && startChatData?.message && !hasStartedChat.current) {
      resetChatData();
      hasStartedChat.current = true;
      startNewChat();
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

  return (
    <div className="flex gap-10 justify-center">
      <div className="fixed top-0 left-0 h-16 bg-fade-inverse z-[1] w-[calc(100vw-1rem)]"></div>
      <div className="relative flex flex-col h-[calc(100vh-3rem)] justify-between bg-background animate-in fade-in duration-500 pt-8">
        <div>
          <div className="w-[732px] mx-auto pr-0 md:pr-12">
            <div className="mb-6 px-3 md:px-4 flex flex-col gap-6">
              {chatData?.chat_history?.map(
                (message: Message, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg ${
                      message.role === 'user'
                        ? 'bg-background-secondary mt-16 md:mt-10'
                        : 'bg-background-highlight'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-[14px]">
                      {message.question ? (
                          <div>
                            <div ref={messagesEndRef}/>
                            <p className="text-foreground text-lg font-bold">
                              <ReactMarkdown>{message.question}</ReactMarkdown>
                            </p>
                          </div>
                      ) : null}
                      {message.answer ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <Logo />
                            <span>Answer</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground text-base">
                              <ReactMarkdown>{message.answer}</ReactMarkdown>
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              )}
              {isLoading && <TextLoading />}
              {errorMessage && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errorMessage}
                </div>
              )}
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
        {
          Object.entries(resources).length > 0 ? <div className="sticky top-10 left-0 flex flex-col gap-3">
            <p className="text-sm font-bold">Resources</p>
            <ResourcesList
                selectedResources={[resources[11]]}
                hideRemoveButton
                direction="vertical"
                wrapTitle
            />
          </div>  : null
        }
      </div>
    </div>
  );
}
