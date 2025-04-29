'use client';

import { ConversationPageLoading } from '@/components/conversation-page-loading/conversation-page-loading';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useResource } from '@/contexts/ResourcesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, CircleUserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { IChatHistory } from '../conversation/types';

import { Icons } from '@/components/icons';
import MarkdownRenderer from '@/components/markdown-render';
import { ResourcesList } from '@/components/resources-list/resources-list';
import { useInitialMessage } from '@/contexts/InitialMessageContext';
import { cn } from '@/lib/utils';

export default function SearchResults() {
  const [inputValue, setInputValue] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<IChatHistory[]>([]);
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const { initialMessage } = useInitialMessage();
  const { openAuthModal, isAuthenticated, user } = useAuth();
  const {
    chatDatas,
    startChatData,
    isLoadingChats,
    isLoadingStartChat,
    resources: answerResources,
    fetchChat,
    addMessage,
    doChat,
    updateStartChatDate,
    resetChatData,
    fetchRelatedResources
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasStartedChat = useRef(false);
  const { resources, fetchResource, clearResources } = useResource();
  const { updateHistory } = useHistory();
  const router = useRouter();

  useEffect(() => {
    return () => {
      clearResources();
      resetChatData();
    };
  }, [clearResources]);

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
    // const contentIds = chatDatas?.content_ids;
    const authorId = chatDatas?.author_id;
    if (authorId) {
      fetchResource(authorId);
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
        history.resource_id = message.resource_id;
        history.resources = message.resources;

        historyList.push(history);
        history = {};
      }
    });

    setChatHistory(historyList);
  }, [chatDatas?.chat_history]);

  const startNewChat = async () => {
    if (startChatData.message) {
      addMessage({ question: startChatData.message });

      const retrievedChatData = await doChat(
        startChatData?.message,
        startChatData?.contentIds
      );
      router.push(`/conversation?id=${retrievedChatData.session_id}`);

      updateHistory();
      updateStartChatDate(null, null);
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
    if (!message.trim() || isLoadingFollowUp) return;

    setIsLoadingFollowUp(true);

    try {
      setChatHistory([...chatHistory, { question: message }]);
      scrollToLastMessage();
      const result = await doChat(message, undefined, chatId?.toString());
      addMessage({ question: message });
      // setChatHistory([...chatHistory, { question: message, answer: result?.answer }]);
      const relatedResources = await fetchRelatedResources(result?.resource_id);
      addMessage({
        answer: result?.answer,
        resource_id: result?.resource_id,
        resources: relatedResources
      });
      // setTimeout(scrollToLastMessage, 100);
    } finally {
      setIsLoadingFollowUp(false);
      setInputValue('');
      scrollToLastMessage();
    }
  };

  // Load avatar from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAvatar = localStorage.getItem('auth_user_avatar');
      setUserAvatar(storedAvatar);
    }
  }, []);

  // Also update avatar when user changes
  useEffect(() => {
    if (user?.avatar) {
      setUserAvatar(user.avatar);
    }
  }, [user]);

  return (
    <Fragment>
      <div className="flex gap-8 min-h-[calc(100vh-202px)] md:min-h-[calc(100vh-154px)] max-w-[768px] mx-auto">
        {/* Main Content */}
        {isLoadingChats || isLoadingStartChat ? (
          <ConversationPageLoading
            initialMessage={initialMessage}
            userAvatar={userAvatar}
          />
        ) : (
          <div className="flex gap-8 w-full mx-auto">
            <div className="flex flex-1 flex-col">
              {chatHistory.map((chat: IChatHistory, index: number) => {
                const {
                  question,
                  answer,
                  resource_id: resourceIds,
                  resources: answerResources
                } = chat;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl"
                    ref={
                      index === chatHistory.length - 1 ? messagesEndRef : null
                    }
                  >
                    <div className="flex-1 flex flex-col gap-8">
                      <div className="flex items-center gap-3">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <CircleUserIcon className="w-8 h-8" />
                        )}
                        <h2 className="text-base font-normal">{question}</h2>
                      </div>

                      {/* Answer Section */}
                      <div className="grid grid-cols-[2rem_1fr] gap-3 flex-1 rounded-xl">
                        <div className="w-8">
                          {resources?.[0] ? (
                            <img
                              src={resources[0].image_url}
                              width={32}
                              height={32}
                              className="rounded-full object-cover w-8 h-8"
                            />
                          ) : (
                            <Logo className="w-8 h-8" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-2 w-[calc(100vw-5rem)] md:w-auto">
                          <div className="inline-flex items-center gap-2 text-neutral-500 mb-0 rounded-xl">
                            {/* <Book className="h-5 w-5" /> */}
                            <div className="font-normal text-sm">
                              {chatDatas?.author_name ?? 'Answer'}
                            </div>
                          </div>
                          {resourceIds && answerResources ? (
                            <div>
                              <ResourcesList
                                selectedResources={answerResources ?? []}
                                noDetail
                                hideRemoveButton
                              />
                            </div>
                          ) : null}
                          <AnimatePresence mode="wait">
                            {!answer ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 mt-2"
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
                                  // transition={{ delay: index * 0.5 }}
                                  className="leading-relaxed text-gray-200 text-sm"
                                >
                                  <MarkdownRenderer
                                    content={answer as string}
                                    className="prose prose-invert max-w-none [&>p:first-child]:mt-1"
                                  />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        {/* {isLoadingResources ? (
          <ResourcesConversationPageLoading />
        ) : (
          <ResourcesConversationPage resources={resources} />
        )} */}
      </div>
      {/* Search Input */}
      <div className="p-0 md:px-4 md:pt-4 sticky flex flex-col bottom-0 items-center justify-center w-[calc(100vw-2rem)] md:w-full">
        <div className="h-10 w-full bg-fade"></div>
        <div className="w-full bg-black pb-4">
          <motion.div
            className="max-w-3xl relative mx-auto"
            initial={false}
            // animate={inputValue ? { width: '100%' } : { width: '66.666667%' }}
            // transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a follow-up question..."
              maxLength={200}
              disabled={isLoadingFollowUp}
              className="border border-neutral-400 text-white placeholder-gray-400 pr-24 pl-4 py-6 rounded-full transition-all duration-300 focus:border-neutral-300 focus:outline-none outline-none ring-0"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(inputValue);
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-sm text-neutral-700 mr-2">
                {inputValue.length}/200
              </span>
              <Button
                size="icon"
                className="w-8 h-8 sm:w-10 md:h-10 rounded-full bg-primary hover:bg-primary/90 focus:bg:primary/70 flex items-center justify-center shrink-0 disabled:bg-accent-light disabled:cursor-not-allowed"
                disabled={isLoadingFollowUp || !inputValue?.trim()}
                onClick={() => {
                  handleSubmit(inputValue);
                }}
              >
                {isLoadingFollowUp ? (
                  <Icons.spinner className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <ArrowRightIcon
                    className={cn(
                      'w-5 h-5',
                      !inputValue?.trim()
                        ? 'text-white'
                        : 'text-primary-foreground'
                    )}
                  />
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Fragment>
  );
}
