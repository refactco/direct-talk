'use client';

import { ChatInput } from '@/components/ChatInput';
import { ConversationPageLoading } from '@/components/conversation-page-loading/conversation-page-loading';
import { Logo } from '@/components/icons/Logo';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useResource } from '@/contexts/ResourcesContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleUserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { IChatHistory } from '../conversation/types';

import { ResourcesList } from '@/components/resources-list/resources-list';
import { useInitialMessage } from '@/contexts/InitialMessageContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';

export default function SearchResults() {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<IChatHistory[]>([]);
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const messageParam = searchParams.get('message');
  const { initialMessage, setInitialMessage } = useInitialMessage();
  const {
    openAuthModal,
    isAuthenticated,
    user,
    isLoading: isAuthLoading
  } = useAuth();
  const {
    chatDatas,
    startChatData,
    isLoadingChats,
    isLoadingStartChat,
    fetchChat,
    addMessage,
    doChat,
    updateStartChatDate,
    resetChatData,
    fetchRelatedResources,
    setLoadingChatsComplete,
    initializeChatData
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasStartedChat = useRef(false);
  const justCreatedChatId = useRef<string | null>(null);
  const { resources, fetchResource, clearResources } = useResource();
  const { selectedResources, resetSelectedResources } = useSelectedResources();
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
        // Scroll to the last message with proper spacing above the fixed input
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
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
    const messageToUse = startChatData?.message || initialMessage;
    if (messageToUse) {
      // Check if user is authenticated
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }

      try {
        const retrievedChatData = await doChat(
          messageToUse,
          startChatData?.contentIds
        );

        console.log('API result:', retrievedChatData);
        console.log('Resource IDs from API:', retrievedChatData?.resource_id);

        // Fetch related resources for the AI response
        const relatedResources = await fetchRelatedResources(
          retrievedChatData?.resource_id
        );
        console.log('Fetched related resources:', relatedResources);

        if (retrievedChatData?.session_id) {
          // Initialize chat data structure with both question and answer
          const newChatData = {
            session_id: retrievedChatData.session_id,
            content_ids: startChatData?.contentIds || [],
            chat_history: [
              { question: messageToUse },
              {
                answer: retrievedChatData.answer,
                resource_id: retrievedChatData.resource_id,
                resources: relatedResources
              }
            ],
            created_at: new Date().toISOString(),
            session_title:
              messageToUse.substring(0, 50) +
              (messageToUse.length > 50 ? '...' : ''),
            user_id: retrievedChatData.user_id || '',
            author_id: retrievedChatData.author_id || null,
            author_name:
              retrievedChatData.author_name ||
              (selectedResources?.[0] &&
                ('name' in selectedResources[0]
                  ? selectedResources[0].name
                  : selectedResources[0].title))
          };

          // Fetch the author resource for the avatar image first
          // Use the selected author ID since the API might not return author_id
          const authorId =
            retrievedChatData.author_id || selectedResources?.[0]?.id;
          if (authorId) {
            console.log('Fetching author resource for ID:', authorId);
            await fetchResource(Number(authorId));
            console.log(
              'Author resource fetched, current resources:',
              resources
            );
          } else {
            console.log(
              'No author_id available from API or selected resources'
            );
          }

          // Set the complete chat data at once
          initializeChatData(newChatData);

          // Track that we just created this chat to avoid clearing selected resources
          justCreatedChatId.current = retrievedChatData.session_id;
          router.push(`/conversation?id=${retrievedChatData.session_id}`);
          updateHistory();
        }

        updateStartChatDate(null, null);
        setInitialMessage(null); // Clear the initial message after use
      } catch (err: any) {
        if (!isAuthenticated && err.status === 401) {
          openAuthModal();
        }
        console.error('Error starting new chat:', err);
      }
    }
  };

  useEffect(() => {
    if (messageParam && !initialMessage) {
      setInitialMessage(decodeURIComponent(messageParam));
    }
  }, [messageParam, initialMessage, setInitialMessage]);

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (isAuthLoading) return;

    if (chatId) {
      // Check if this is a chat we just created to avoid clearing local data
      const isJustCreatedChat = justCreatedChatId.current === chatId;

      if (!isJustCreatedChat) {
        // Only reset data when viewing a different existing chat
        resetChatData();
        clearResources();
        resetSelectedResources();
      } else {
        // Clear the ref after using it
        justCreatedChatId.current = null;
      }

      updateStartChatDate(null, null);

      // Only fetch chat if user is authenticated and it's not a newly created chat
      if (isAuthenticated && !isJustCreatedChat) {
        fetchChat(chatId).catch((err) => {
          if (err.status === 401) {
            openAuthModal();
          }
        });
      } else if (!isAuthenticated) {
        // If not authenticated after loading is complete, show auth modal
        openAuthModal();
      }

      // For newly created chats, we already have the data, so stop loading
      if (isJustCreatedChat && isAuthenticated) {
        // We need to manually set loading to false since we skipped fetchChat
        setLoadingChatsComplete();
      }
    } else if (
      !chatId &&
      (startChatData?.message || initialMessage) &&
      !hasStartedChat.current
    ) {
      const messageToUse = startChatData?.message || initialMessage;
      if (messageToUse) {
        resetChatData();
        hasStartedChat.current = true;
        updateStartChatDate(messageToUse, startChatData?.contentIds || null);
        startNewChat();
      }
    }
  }, [
    chatId,
    startChatData?.message,
    initialMessage,
    isAuthenticated,
    isAuthLoading
  ]);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoadingFollowUp) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsLoadingFollowUp(true);

    try {
      setChatHistory([...chatHistory, { question: message }]);
      scrollToLastMessage();
      const result = await doChat(message, undefined, chatId?.toString());
      addMessage({ question: message });

      console.log('API result:', result);
      console.log('Resource IDs from API:', result?.resource_id);

      const relatedResources = await fetchRelatedResources(result?.resource_id);
      console.log('Fetched related resources:', relatedResources);

      addMessage({
        answer: result?.answer,
        resource_id: result?.resource_id,
        resources: relatedResources
      });
      // setTimeout(scrollToLastMessage, 100);
    } catch (err: any) {
      if (!isAuthenticated && err.status === 401) {
        openAuthModal();
      }
    } finally {
      setIsLoadingFollowUp(false);
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
                    <div className="flex-1 flex flex-col gap-8 mb-12">
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
                              >
                                <p
                                  className="text-base text-foreground font-normal whitespace-pre-wrap"
                                  style={{
                                    lineHeight: '28px',
                                    fontSize: '16px'
                                  }}
                                >
                                  {answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {resourceIds &&
                            resourceIds.length > 0 &&
                            answerResources &&
                            answerResources.length > 0 && (
                              <div className="mt-6">
                                <div className="text-sm font-semibold text-foreground mb-3">
                                  Resources
                                </div>
                                <ResourcesList
                                  selectedResources={answerResources}
                                />
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Chat Input - always visible at bottom, aligned with conversation */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="h-10 w-full bg-fade"></div>
        <div className="w-full bg-background pb-8">
          <div className="flex">
            {/* Sidebar space - responsive to sidebar width */}
            <div className="hidden md:block sidebar-spacer flex-shrink-0"></div>

            {/* Chat input container - matches main content area */}
            <div className="flex-1 px-4 md:px-8">
              <div className="max-w-[768px] mx-auto">
                <ChatInput
                  onSubmit={handleSubmit}
                  isLoading={isLoadingFollowUp}
                  placeholder="Ask a follow-up question..."
                  resetAfterSubmit={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
