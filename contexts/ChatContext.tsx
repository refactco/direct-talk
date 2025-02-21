'use client';

import { ChatData, Message } from '@/app/conversation/types';
import type React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import apiClient from '@/lib/axiosInstance';

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const baseURL = process.env.NEXT_PUBLIC_BASE_AI_API_URL as string;

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [chatDatas, setChatDatas] = useState<ChatData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // formData['content_ids'] = ["63dbf9f4-c510-4685-802f-efac4682bc5c"];
      }
      try {
        const response = await apiClient.post(`${baseURL}/search`, formData);
        const data = await response.data;
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
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
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
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

  const value = {
    chatDatas,
    isLoading,
    isLoadingChats,
    error,
    doChat,
    fetchChat,
    addMessage
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
