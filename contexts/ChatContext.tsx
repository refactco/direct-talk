'use client';

import { ChatData, Message, StartChatData } from '@/app/conversation/types';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/axiosInstance';
import toastConfig from '@/lib/toast-config';
import { TSelectedResource } from '@/types/resources';
import type React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { useSelectedResources } from './SelectedResourcesContext';

interface ChatContextType {
  chatDatas: ChatData | null;
  isLoading: boolean;
  isLoadingChats: boolean;
  isLoadingStartChat: boolean;
  isLoadingResources: boolean;
  error: string | null;
  doChat: (
    prompt: string,
    contentId?: string[] | null,
    sessionId?: string
  ) => Promise<any>;
  fetchChat: (chatId: string) => Promise<any>;
  addMessage: (message: Message) => void;
  resetChatData: () => void;
  startChatData: StartChatData;
  updateStartChatDate: (
    message: string | null,
    contentIds: string[] | null
  ) => void;
  resources: TSelectedResource[];
  fetchRelatedResources: (
    resourceIds: string[]
  ) => Promise<TSelectedResource[]>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const baseURL = process.env.NEXT_PUBLIC_BASE_AI_API_URL as string;

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [chatDatas, setChatDatas] = useState<ChatData | null>(null);
  const [startChatData, setStartChatData] = useState<StartChatData | null>(
    null
  );
  const [resources, setResources] = useState<TSelectedResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStartChat, setIsLoadingStartChat] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { selectedResources } = useSelectedResources();

  const updateStartChatDate = (
    message: string | null,
    contentIds: string[] | null
  ) => {
    setStartChatData({ message, contentIds });
  };

  const fetchRelatedResources = async (
    resourceIds: string[]
  ): Promise<TSelectedResource[]> => {
    const fetchedResources = await Promise.all(
      resourceIds.map(async (id: string) => {
        const response = await fetch(`/api/resources/${id}`);
        const data = await response.json();

        return data;
      })
    );

    return fetchedResources;
  };

  const doChat = useCallback(
    async (
      prompt: string,
      contentId?: string[] | null,
      sessionId?: string
    ): Promise<any> => {
      setIsLoading(true);
      setError(null);
      const formData: any = { question: prompt };
      if (sessionId) {
        formData['session_id'] = sessionId;
      } else {
        setIsLoadingStartChat(true);
      }
      if (contentId && contentId?.length > 0) {
        formData['content_ids'] = contentId;
      }

      if (selectedResources && selectedResources?.length > 0) {
        formData['author_name'] = selectedResources[0].name;
        formData['author_id'] = selectedResources[0].id;
      }
      try {
        const response = await apiClient.post(`${baseURL}/search`, formData);

        const data = await response.data;

        return data;
      } catch (err) {
        const toastLimitConf: any = toastConfig({
          message:
            err instanceof Error ? err.message : 'An unknown error occurred',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
        throw err;
      } finally {
        setIsLoading(false);
        setIsLoadingStartChat(false);
      }
    },
    [selectedResources, fetchRelatedResources, toast]
  );

  const fetchChat = useCallback(
    async (sessionId: string): Promise<void> => {
      setIsLoadingChats(true);
      setError(null);
      try {
        const response = await apiClient.get(`${baseURL}/search/${sessionId}`);
        const data = await response.data;

        // Process chat history items with resource_ids
        if (data.chat_history && Array.isArray(data.chat_history)) {
          const updatedChatHistory = await Promise.all(
            data.chat_history.map(async (item: Message) => {
              if (
                item.resource_id &&
                Array.isArray(item.resource_id) &&
                item.resource_id.length > 0
              ) {
                try {
                  const fetchedResources = await fetchRelatedResources(
                    item.resource_id
                  );

                  return {
                    ...item,
                    resources: fetchedResources
                  };
                } catch (error) {
                  return item;
                }
              }
              return item;
            })
          );

          // Update data with the processed chat history
          data.chat_history = updatedChatHistory;
        }

        setChatDatas(data);
      } catch (err: any) {
        const toastLimitConf: any = toastConfig({
          message:
            err instanceof Error ? err.message : 'An unknown error occurred',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
        throw err;
      } finally {
        setIsLoadingChats(false);
      }
    },
    [toast]
  );

  const addMessage = (message: Message) => {
    setChatDatas((prevChatData) => {
      if (!prevChatData) return null;
      return {
        ...prevChatData,
        chat_history: [...prevChatData.chat_history, message]
      };
    });
  };

  const resetChatData = () => {
    setChatDatas(null);
    setResources([]);
  };

  const value = {
    chatDatas,
    isLoading,
    isLoadingChats,
    isLoadingStartChat,
    isLoadingResources,
    error,
    doChat,
    fetchChat,
    addMessage,
    startChatData: startChatData || { message: null, contentIds: null },
    updateStartChatDate,
    resetChatData,
    resources,
    fetchRelatedResources
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
