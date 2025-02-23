'use client';

import {ChatData, Message, StartChatData} from '@/app/conversation/types';
import type React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import apiClient from '@/lib/axiosInstance';
import toastConfig from '@/lib/toast-config';
import { useToast } from '@/hooks/use-toast';

interface ChatContextType {
  chatDatas: ChatData | null;
  isLoading: boolean;
  isLoadingChats: boolean;
  error: string | null;
  doChat: (
    prompt: string,
    contentId?: string[],
    sessionId?: string
  ) => Promise<any>;
  fetchChat: (chatId: string) => Promise<any>;
  addMessage: (message: Message) => void;
  resetChatData: () => void;
  startChatData: StartChatData;
  updateStartChatDate: (message: string | null, contentIds: string[] | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const baseURL = process.env.NEXT_PUBLIC_BASE_AI_API_URL as string;

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [chatDatas, setChatDatas] = useState<ChatData | null>(null);
  const [startChatData, setStartChatData] = useState<StartChatData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateStartChatDate = (message: string | null, contentIds: string[] | null) => {
    setStartChatData({ message, contentIds });
  };

  const doChat = useCallback(
    async (
      prompt: string,
      contentIds?: string[],
      sessionId?: string
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      const formData: any = { question: prompt };
      if (sessionId) {
        formData['session_id'] = sessionId;
      }
      if (contentIds && contentIds?.length > 0) {
        formData['content_ids'] = contentIds;
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
      }
    },
    []
  );

  const fetchChat = useCallback(async (sessionId: string): Promise<void> => {
    setIsLoadingChats(true);
    setError(null);
    try {
      const response = await apiClient.get(`${baseURL}/search/${sessionId}`);
      const data = await response.data;
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
  }, []);

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
    setChatDatas(null)
  }

  const value = {
    chatDatas,
    isLoading,
    isLoadingChats,
    error,
    doChat,
    fetchChat,
    addMessage,
    startChatData,
    updateStartChatDate,
    resetChatData
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
