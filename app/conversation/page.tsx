'use client';

import { ConversationPageLoading } from '@/components/conversation-page-loading/conversation-page-loading';
import { Logo } from '@/components/icons/Logo';
import { ResourcesList } from '@/components/resources-list/resources-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useResource } from '@/contexts/ResourcesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircleQuestion, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IChatHistory } from '../conversation/types';

interface Resource {
  type: string;
  title: string;
  image: string;
}
import MarkdownRenderer from '@/lib/markdown-render';

export default function SearchResults() {
  // const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    console.log({ startNewChat: true });
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
    console.log({ chatId });

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

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isLoadingChats || isLoadingResources) {
    return <ConversationPageLoading />;
  }

  return (
    <div className="">
      {/* Main Content */}
      <div className="flex gap-8 min-h-[calc(100vh-117px)]">
        <div className="flex flex-1 flex-col">
          {chatHistory.map((chat: IChatHistory, index: number) => {
            const { question, answer } = chat;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 max-w-5xl"
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <MessageCircleQuestion className="h-6 w-6" />
                    <h2 className="text-2xl font-semibold">{question}</h2>
                  </div>

                  {/* Answer Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      {/* <Book className="h-5 w-5" /> */}
                      <Logo />
                      <div className="font-medium">Answer</div>
                    </div>

                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <Skeleton className="h-4 w-[90%]" />
                          <Skeleton className="h-4 w-[80%]" />
                          <Skeleton className="h-4 w-[85%]" />
                          <Skeleton className="h-4 w-[75%]" />
                          <Skeleton className="h-4 w-[88%]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.5 }}
                            className="leading-relaxed text-gray-200"
                          >
                            <MarkdownRenderer content={answer as string} />
                          </motion.div>
                          {/* {paragraphs.map((text, index) => (
                        ))} */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Resources Section */}
        <div className="w-60 mt-6">
          <div className="sticky top-0">
            <div className="text-sm text-gray-400 mb-4">Resources</div>
            <AnimatePresence mode="wait">
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <ResourcesList
                  selectedResources={resources}
                  hideRemoveButton
                  direction="vertical"
                  wrapTitle
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Search Input */}
      <div className="p-4 border-t border-white/10 sticky flex bottom-0 items-center justify-center w-full bg-background">
        <motion.div
          className="max-w-3xl relative"
          initial={false}
          animate={inputValue ? { width: '100%' } : { width: '66.666667%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a follow-up question..."
            maxLength={200}
            className="bg-[#1c1917] border-2 border-[#27272a] text-white placeholder-gray-400 pr-24 pl-4 py-6 rounded-full transition-all duration-300 focus:border-[#4a4a4f] focus:outline-none outline-none ring-0"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(inputValue);
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <span className="text-sm text-gray-400 mr-2">
              {inputValue.length}/200
            </span>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-[#4a4a4f] hover:bg-[#5a5a5f] transition-colors duration-300"
              onClick={() => {
                handleSubmit(inputValue);
              }}
            >
              <Send className="h-5 w-5 stroke-white" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
