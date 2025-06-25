'use client';

import apiClient from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface HistoryItem {
  content_ids: Array<string>;
  session_id: string;
  session_title: string;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  removeHistoryItem: (
    id: string,
    active_session_id: string | null,
    onRemoveComplete: () => void
  ) => void;
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
  const { isAuthenticated } = useAuth();

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      
      // Skip API call if user is not authenticated
      if (!isAuthenticated) {
        setHistoryItems([]);
        return;
      }
      
      // Skip API call if using mocked data
      const useMockedData = process.env.NEXT_PUBLIC_MOCKED_DATA === 'true';
      if (useMockedData) {
        // Return empty history for mocked data
        setHistoryItems([]);
        return;
      }
      
      // Skip API call if base URL is not configured
      if (!baseURL) {
        console.warn('NEXT_PUBLIC_BASE_AI_API_URL is not configured');
        setHistoryItems([]);
        return;
      }
      
      const response = await apiClient.get(`${baseURL}/search`);
      const data = await response.data;
      setHistoryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      if (err instanceof AxiosError && err.status === 401) {
        console.warn('Unauthorized access to chat history');
        setHistoryItems([]);
      } else {
        setHistoryItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (historyItems?.length == 0 && isAuthenticated) {
      fetchChatHistory();
    }
  }, [isAuthenticated]);

  const updateHistory = () => {
    fetchChatHistory();
  };

  const removeHistoryItem = async (
    session_id: string,
    active_session_id: string | null,
    onRemoveComplete: () => void
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
        if (active_session_id && active_session_id === session_id) {
          router.push('/');
        }
      }
      onRemoveComplete();
    } catch (err) {
      console.error('Error removing history item:', err);
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
