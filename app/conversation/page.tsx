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
import { ArrowRightIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { IChatHistory } from '../conversation/types';

import MarkdownRenderer from '@/components/markdown-render';
import { cn } from '@/lib/utils';
import { ResourcesConversationPageLoading } from '@/app/conversation/resources-list/resources-loading';
import { ResourcesConversationPage } from '@/app/conversation/resources-list/resources-list';
import {Icons} from "@/components/icons";

export default function SearchResults() {
  const [inputValue, setInputValue] = useState('');

  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<IChatHistory[]>([]);
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
    isLoadingChats,
    isLoadingStartChat
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
      addMessage({ question: message });
      scrollToLastMessage();
      const result = await doChat(message, undefined, chatId?.toString());
      addMessage({ answer: result?.answer });
    } finally {
      setIsLoadingFollowUp(false);
      setInputValue('');
      scrollToLastMessage();
    }
  };


  return (
    <Fragment>
      {isLoadingResources ? (
        <ResourcesConversationPageLoading />
      ) : (
        <ResourcesConversationPage resources={resources} />
      )}
      {/* Main Content */}
      {
        isLoadingChats || isLoadingStartChat ? <ConversationPageLoading/> : null
      }
      <div className="flex gap-8 min-h-[calc(100vh-117px)] w-full md:w-[732px] mx-auto">
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
                  <h2 className="text-lg font-bold mb-6">{question}</h2>

                  {/* Answer Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      {/* <Book className="h-5 w-5" /> */}
                      <Logo />
                      <div className="font-medium">Answer</div>
                    </div>

                    <AnimatePresence mode="wait">
                      {isLoadingChats ? (
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Search Input */}
      <div className="p-4 sticky flex flex-col bottom-0 items-center justify-center w-full">
        <div className="h-10 w-full bg-fade"></div>
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
            disabled={isLoadingFollowUp}
            className="border border-border text-white placeholder-gray-400 pr-24 pl-4 py-6 rounded-full transition-all duration-300 focus:border-[#4a4a4f] focus:outline-none outline-none ring-0"
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
              className="w-8 h-8 sm:w-10 md:h-10 rounded-full bg-primary hover:bg-primary/90 focus:bg:primary/70 flex items-center justify-center shrink-0 disabled:bg-accent-light disabled:cursor-not-allowed"
              disabled={isLoadingFollowUp || !inputValue?.trim()}
              onClick={() => {
                handleSubmit(inputValue);
              }}
            >
              {
                isLoadingFollowUp ? <Icons.spinner className="h-4 w-4 animate-spin text-white" /> :  <ArrowRightIcon
                    className={cn(
                        'w-5 h-5',
                        !inputValue?.trim() ? 'text-white' : 'text-primary-foreground'
                    )}
                />
              }
            </Button>
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
}
