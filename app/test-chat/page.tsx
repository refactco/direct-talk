'use client';

import { ResourcesList } from '@/components/resources-list/resources-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useResource } from '@/contexts/ResourcesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, MessageCircleQuestion, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IChatHistory } from '../conversation/types';

interface Resource {
  type: string;
  title: string;
  image: string;
}

export default function SearchResults() {
  // const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

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

  // const resources: Resource[] = [
  //   {
  //     type: 'BOOK',
  //     title: 'Harry Potter',
  //     image: '/placeholder.svg?height=40&width=40'
  //   },
  //   {
  //     type: 'BOOK',
  //     title: 'Fabrics of sepien',
  //     image: '/placeholder.svg?height=40&width=40'
  //   },
  //   {
  //     type: 'BOOK',
  //     title: 'Harry Potter',
  //     image: '/placeholder.svg?height=40&width=40'
  //   }
  // ];

  const paragraphs = [
    'Harry Potter is a fictional character and the protagonist of the Harry Potter series, created by British author J.K. Rowling. His full name is Harry James Potter, and he is introduced as an orphan living with his neglectful aunt and uncle, the Dursleys. On his eleventh birthday, Harry discovers that he is a wizard and receives an invitation to attend Hogwarts School of Witchcraft and Wizardry.',
    "The series chronicles Harry's journey over seven years as he learns about magic, makes close friends like Ron Weasley and Hermione Granger, and confronts the dark wizard Lord Voldemort, who murdered his parents. Harry's survival from Voldemort's killing curse as a baby left him with a distinctive lightning-bolt-shaped scar on his forehead, earning him the title of \"The Boy Who Lived\" in the wizarding world.",
    'The Harry Potter series consists of seven books, starting with Harry Potter and the Philosopher\'s Stone (1997), and has been adapted into eight successful films. The books have sold over 600 million copies worldwide, making them the best-selling book series in history. Harry Potter has become a cultural icon, influencing various aspects of society and inspiring a dedicated fan base known as "Potterheads"'
  ];

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#09090b] text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">
        {chatHistory.map((chat: IChatHistory, index: number) => {
          const { question, answer } = chat;

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 max-w-5xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <MessageCircleQuestion className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">{question}</h2>
              </div>

              <div className="flex gap-8">
                {/* Answer Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Book className="h-5 w-5" />
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
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.5 }}
                          className="leading-relaxed text-gray-200"
                        >
                          {answer}
                        </motion.p>
                        {/* {paragraphs.map((text, index) => (
                        ))} */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Resources Section */}
                <div className="w-60">
                  <div className="text-sm text-gray-400 mb-4">Resources</div>
                  <AnimatePresence mode="wait">
                    {isLoadingResources ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        {[1, 2].map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5"
                          >
                            <Skeleton className="w-10 h-10 rounded" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-3 w-12" />
                              <Skeleton className="h-4 w-[80%]" />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
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
                        {/* {resources.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#27272a] cursor-pointer hover:bg-[#343330] transition-colors"
                      >
                        <img
                          src={resource.image || '/placeholder.svg'}
                          alt={resource.title}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <div className="text-xs text-gray-400">
                            {resource.type}
                          </div>
                          <div className="text-sm">{resource.title}</div>
                        </div>
                      </motion.div>
                    ))} */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Search Input */}
        <div className="p-4 border-t border-white/10 fixed flex bottom-0 items-center justify-center w-[calc(100%-322px)] bg-background">
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
              className="bg-[#1c1917] border-2 border-[#27272a] text-white placeholder-gray-400 pr-24 pl-4 py-6 rounded-full transition-all duration-300 focus:border-[#4a4a4f] focus:ring-2 focus:ring-[#4a4a4f] focus:ring-opacity-50 focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-sm text-gray-400 mr-2">
                {inputValue.length}/200
              </span>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-[#4a4a4f] hover:bg-[#5a5a5f] transition-colors duration-300"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
