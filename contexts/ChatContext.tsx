'use client';

import { ChatData, Message, StartChatData } from '@/app/conversation/types';
import apiClient from '@/lib/axiosInstance';
import { TSelectedResource } from '@/types/resources';
import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
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
    resourceIds: string[],
    shouldLog?: boolean
  ) => Promise<TSelectedResource[]>;
  setLoadingChatsComplete: () => void;
  initializeChatData: (chatData: ChatData) => void;
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
  const [isLoadingResources] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedResources } = useSelectedResources();

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem('startChatData');
      if (stored) {
        setStartChatData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading start chat data from localStorage:', error);
    }
  }, []);

  const updateStartChatDate = (
    message: string | null,
    contentIds: string[] | null
  ) => {
    const newStartChatData = { message, contentIds };
    setStartChatData(newStartChatData);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        if (message || contentIds) {
          localStorage.setItem(
            'startChatData',
            JSON.stringify(newStartChatData)
          );
        } else {
          localStorage.removeItem('startChatData');
        }
      } catch (error) {
        console.error('Error saving start chat data to localStorage:', error);
      }
    }
  };

  const fetchRelatedResources = async (
    resourceIds: string[],
    shouldLog: boolean = true
  ): Promise<TSelectedResource[]> => {
    if (!resourceIds || resourceIds.length === 0) {
      return [];
    }

    try {
      // Import the mocked data to match resources
      const { mockAllEpisodes } = await import('@/app/api/mocked-data');

      // Find matching episodes based on ref_id
      const matchedResources = mockAllEpisodes.filter((episode) =>
        resourceIds.includes(episode.ref_id)
      );

      if (shouldLog) {
        console.log('Matched resources:', matchedResources);
      }
      return matchedResources as unknown as TSelectedResource[];
    } catch (error) {
      console.error('Error fetching related resources:', error);
      return [];
    }
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
        const resource = selectedResources[0];
        formData['author_name'] =
          'name' in resource ? resource.name : resource.title;
        formData['author_id'] = String(resource.id); // Ensure it's a string
      }

      // Debug: Log the data being sent to the API
      console.log('Sending data to API:', formData);

      try {
        const response = await apiClient.post(`${baseURL}/search`, formData);

        const data = await response.data;

        return data;
      } catch (err: any) {
        console.error('Error fetching chat:', err);
        if (err.response) {
          console.error('API Response Error:', {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data,
            headers: err.response.headers
          });
        }
        throw err;
      } finally {
        setIsLoading(false);
        setIsLoadingStartChat(false);
      }
    },
    [selectedResources, fetchRelatedResources]
  );

  const fetchChat = useCallback(async (sessionId: string): Promise<void> => {
    setIsLoadingChats(true);
    setError(null);
    try {
      const response = await apiClient.get(`${baseURL}/search/${sessionId}`);
      const data = await response.data;

      // Process chat history items with resource_ids
      if (data.chat_history && Array.isArray(data.chat_history)) {
        let totalResourcesFetched = 0;
        const updatedChatHistory = await Promise.all(
          data.chat_history.map(async (item: Message) => {
            if (
              item.resource_id &&
              Array.isArray(item.resource_id) &&
              item.resource_id.length > 0
            ) {
              try {
                const fetchedResources = await fetchRelatedResources(
                  item.resource_id,
                  false // Disable individual logging for bulk operations
                );
                totalResourcesFetched += fetchedResources.length;

                return {
                  ...item,
                  resources: fetchedResources
                };
              } catch {
                return item;
              }
            }
            return item;
          })
        );

        // Log summary instead of individual calls
        if (totalResourcesFetched > 0) {
          console.log(
            `Loaded chat with ${data.chat_history.length} messages and ${totalResourcesFetched} total resources`
          );
        }

        // Update data with the processed chat history
        data.chat_history = updatedChatHistory;
      }

      setChatDatas(data);
    } catch (err: any) {
      console.error('Error fetching chat:', err);
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
    setChatDatas(null);
    setResources([]);
  };

  const setLoadingChatsComplete = () => {
    setIsLoadingChats(false);
  };

  const initializeChatData = (chatData: ChatData) => {
    setChatDatas(chatData);
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
    fetchRelatedResources,
    setLoadingChatsComplete,
    initializeChatData
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
