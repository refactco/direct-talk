"use client";

import { AuthModal } from "@/components/AuthModal";
import { ChatInput } from "@/components/ChatInput";
import { SearchModal } from "@/components/search-modal/search-modal";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { getResource } from "@/lib/api";
import {
  addChatToHistory,
  addMessageToChat,
  createNewChat
} from "@/lib/history-storage";
import { Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content?: string;
  result?: string;
}

interface ChatData {
  id: string;
  content_id: string;
  messages: Message[];
}

const sendMessage = async (
  prompt: string,
  chatId: string,
  contentId: string
) => {
  try {
    console.log("Sending message to API:", { prompt, chatId, contentId });
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        chat_id: chatId,
        content_id: contentId
      })
    });

    console.log("API response status:", response.status);
    const data = await response.json();
    console.log("API response data:", data);
    return data.messages[0].content;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

function ChatConversationPage() {
  const {
    selectedResources,
    addResource,
    removeResource,
    contextSelectedResource
  } = useSelectedResources();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchChatData = useCallback(
    async (id: string) => {
      try {
        if (id === "new") {
          return {
            id: "new",
            content_id: selectedResources[0]?.id || "",
            messages: []
          };
        }
        const response = await fetch(`/api/chat?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chat data");
        }
        const data = await response.json();
        if (
          data.contentId &&
          (!selectedResources[0] || selectedResources[0].id !== data.contentId)
        ) {
          const resource = await getResource(data.contentId);
          addResource(resource);
        }
        return data;
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setErrorMessage("Failed to load chat. Please try again.");
        return null;
      }
    },
    [selectedResources, addResource]
  );

  useEffect(() => {
    const id = searchParams.get("id") || "new";
    if (id && id !== chatId) {
      setChatId(id);
      fetchChatData(id).then((data) => {
        if (data) {
          setChatData(data);
          setMessages(data.messages);
        } else {
          // If no chat data is found, show the auth modal
          setIsAuthModalOpen(true);
        }
      });
    }
  }, [searchParams, chatId, fetchChatData]);

  useEffect(() => {
    if (chatId === "new" && selectedResources[0]) {
      setMessages([
        {
          role: "assistant",
          content: `Welcome! You're now chatting about "${selectedResources[0].title}". What would you like to know?`
        }
      ]);
    }
  }, [chatId, selectedResources]);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading || selectedResources.length === 0) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let currentChatId = chatId;
      if (currentChatId === "new" || !currentChatId) {
        currentChatId = await createNewChat(selectedResources[0].id, message);
        setChatId(currentChatId);
        router.push(`/chat/conversation?id=${currentChatId}`);
      }

      const contentId = selectedResources[0].id;

      console.log("Sending message with:", {
        currentChatId,
        contentId,
        message
      });

      const result = await sendMessage(message, currentChatId, contentId);
      const assistantMessage = { role: "assistant", content: result };
      setMessages((prev) => [...prev, assistantMessage]);
      await addMessageToChat(currentChatId, {
        role: "assistant",
        content: result
      });

      setChatData((prevChatData) => ({
        id: currentChatId,
        content_id: contentId,
        messages: [
          ...(prevChatData?.messages || []),
          { role: "user", content: message },
          assistantMessage
        ]
      }));

      // Update chat history
      const updatedChatItem = {
        id: currentChatId,
        title: message,
        contentId: selectedResources[0].id,
        createdAt: new Date().toISOString()
      };
      addChatToHistory(updatedChatItem);

      // Trigger a custom event to notify the sidebar of the chat history update
      window.dispatchEvent(new CustomEvent("chatHistoryUpdated"));
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage(
        `Failed to get response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthModalOpen(false);
    // After authentication, try to fetch chat data again or create a new chat
    if (chatId === "new") {
      handleSubmit(""); // Pass an empty string as we don't have a message here
    } else {
      fetchChatData(chatId).then((data) => {
        if (data) {
          setChatData(data);
          setMessages(data.messages);
        }
      });
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto min-h-[calc(100vh-10rem)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {contextSelectedResource && (
            <div className="flex items-center gap-2 sm:gap-3 bg-[#262626] rounded-lg px-2 sm:px-3 h-12 sm:h-[58px] relative mb-4 sm:mb-6">
              <div className="h-8 w-6 sm:h-10 sm:w-8 overflow-hidden rounded">
                <Image
                  src={contextSelectedResource.imageUrl || "/placeholder.svg"}
                  alt={contextSelectedResource.title}
                  width={32}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow min-w-0 pr-6">
                <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                  {contextSelectedResource.title}
                </span>
                <span className="text-xs text-white leading-tight">
                  {contextSelectedResource.type}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`space-y-2 sm:space-y-4 p-3 sm:p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-background-secondary"
                    : "bg-background-highlight"
                }`}
              >
                <div className="flex items-start">
                  {message.role === "assistant" && (
                    <div className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full mr-2 sm:mr-3 bg-secondary text-secondary-foreground">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {message.content || message.result}
                    </p>
                  </div>
                </div>
                {message.role === "assistant" && selectedResources[0] && (
                  <div className="mt-1 sm:mt-2 flex items-center text-xs text-muted-foreground">
                    <Book className="w-3 h-3 mr-1" />
                    <span>Source: </span>
                    <Link
                      href={`/resources/${selectedResources[0].id}`}
                      className="ml-1 hover:underline"
                    >
                      {selectedResources[0].title}
                    </Link>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-xs sm:text-sm text-muted-foreground animate-pulse flex items-center">
                <div className="mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="mr-2 h-1 w-1 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                AI is thinking...
              </div>
            )}
            {errorMessage && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-background pb-4 sm:pb-6 pt-2 sm:pt-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ChatInput
            onSubmit={handleSubmit}
            onAddResource={() => setIsResourceSelectorOpen(true)}
            onRemoveResource={removeResource}
            selectedResources={selectedResources}
            isLoading={isLoading}
            placeholder="Ask follow-up..."
          />
        </div>
      </div>

      <SearchModal
        open={isResourceSelectorOpen}
        onOpenChange={setIsResourceSelectorOpen}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => router.push("/")}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}

const WrappedChatConversationPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChatConversationPage />
  </Suspense>
);

export default WrappedChatConversationPage;
