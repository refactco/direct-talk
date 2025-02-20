'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';

export interface HistoryItem {
  content_ids: Array<string>;
  session_id: string;
  session_title: string;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  removeHistoryItem: (id: string, active_session_id: string | null) => void;
  updateHistory: () => void;
  isLoading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const baseURL = process.env.NEXT_PUBLIC_BASE_AI_API_URL as string;

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`${baseURL}/search`);
      const data = await response.data?.reverse();
      setHistoryItems(data);
    } catch (err) {
      console.log(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      if (err.status == 401) {
        setHistoryItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (historyItems?.length == 0) {
      fetchChatHistory();
    }
  }, []);

  const updateHistory = () => {
    fetchChatHistory();
  };

  const removeHistoryItem = async (
    session_id: string,
    active_session_id: string
  ) => {
    try {
      const response = await apiClient.delete(
        `${baseURL}/search/${session_id}`
      );
      if (response.status == 204) {
        setHistoryItems((prevItems) => {
          const newItems = prevItems.filter(
            (item) => item.session_id !== session_id
          );
          return newItems;
        });
        if (active_session_id == session_id) {
          router.push('/');
        }
      }
    } catch (err) {
      console.log(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  const value = {
    historyItems,
    updateHistory,
    removeHistoryItem,
    isLoading
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
