"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  doChat: (
    prompt: string,
    contentId: string,
    sessionId?: string
  ) => Promise<any>;
  fetchChat: (chatId: string) => Promise<any>;
  addMessage: (message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const BASE_API_CHAT = "https://api-focus.sajjadrad.com/v1";

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doChat = useCallback(
    async (
      prompt: string,
      contentIds: string,
      sessionId?: string
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      const formData: any = { prompt: prompt, content_ids: "potter" };
      // const formData: any = { prompt: prompt , content_ids: contentIds }
      if (sessionId) {
        formData["session_id"] = sessionId;
      }
      try {
        const response = await fetch(`${BASE_API_CHAT}/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer TEST_API_KEY"
          },
          body: new URLSearchParams(formData)
        });

        if (!response.ok) {
          throw new Error("Failed to create chat");
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchChat = useCallback(async (chatId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_API_CHAT}/search/${chatId}`, {
        headers: {
          Authorization: "Bearer TEST_API_KEY"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const value = {
    messages,
    isLoading,
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
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
