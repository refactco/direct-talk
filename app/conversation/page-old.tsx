'use client';

import { ChatInput } from '@/components/ChatInput';
import { Logo } from '@/components/icons/Logo';
import { ResourcesList } from '@/components/resources-list/resources-list';
import { TextLoading } from '@/components/text-loading/text-loading';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useResource } from '@/contexts/ResourcesContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'; // Add Suspense
import ReactMarkdown from 'react-markdown';
import { IChatHistory } from './types';

export default function ChatConversationPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStartChatting, setIsStartChatting] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<IChatHistory[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const { openAuthModal, isAuthenticated } = useAuth();
  const {
    fetchChat,
    chatDatas,
    addMessage,
    doChat,
    startChatData,
    updateStartChatDate,
    resetChatData,
    isLoadingChats
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasStartedChat = useRef(false);
  const {
    resources,
    isLoading: isLoadingResources,
    fetchResource
  } = useResource();
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
    scrollToLastMessage();
    const contentIds = chatDatas?.content_ids;

    if (contentIds?.length) {
      fetchResource(contentIds);
    }
  }, [chatDatas?.session_id]);

  useEffect(() => {
    let history: any = {};
    const historyList: IChatHistory[] = [];

    chatDatas?.chat_history?.forEach((message: any) => {
      if (message.question) {
        history.question = message.question;
      } else if (message.answer) {
        history.answer = message.answer;

        historyList.push(history);
        history = {};
      }
    });

    setChatHistory(historyList);
  }, [chatDatas?.chat_history]);

  const startNewChat = async () => {
    if (startChatData.message) {
      setIsStartChatting(true);
      addMessage({ question: startChatData.message });

      const retrievedChatData = await doChat(
        startChatData?.message,
        startChatData?.contentIds
      );
      router.push(`/conversation?id=${retrievedChatData.session_id}`);

      updateHistory();
      updateStartChatDate(null, null);
      setIsStartChatting(false);
    }
  };

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
    <div className="flex flex-col md:flex-row gap-10 justify-center mt-4 md:mt-0">
      <div className="hidden md:fixed top-0 left-0 h-16 bg-fade-inverse z-[1] w-[calc(100vw-1rem)]"></div>
      <div className="relative flex flex-col order-2 md:order-1 min-h-[calc(100vh-3rem)] justify-between bg-background animate-in fade-in duration-500 md:pt-8">
        <div>
          <div className="w-full md:w-[732px] mx-auto pr-0 md:pr-12">
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
                        <div ref={messagesEndRef} />
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
              {isLoading || isStartChatting ? (
                <>
                  {!isStartChatting ? <hr className="w-full my-6" /> : null}
                  <TextLoading text="AI is thinking" />
                </>
              ) : null}
              {isLoadingChats && !isStartChatting ? (
                <TextLoading text="Is Fetching" />
              ) : null}
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
              hideResources
              isLoading={isLoading}
              placeholder="Ask follow-up..."
              resetAfterSubmit
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-44 md:mt-10 order-1 md:order-2">
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
