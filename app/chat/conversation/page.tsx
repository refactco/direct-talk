"use client";

import { Message } from "@/app/chat/conversation/types";
import { ChatInput } from "@/components/ChatInput";
import { Logo } from "@/components/icons/Logo";
import { SearchModal } from "@/components/search-modal/search-modal";
import SelectedResourceCard from "@/components/SelectedResourceCard";
import TextLoading from "@/components/TextLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"; // Add Suspense
import ReactMarkdown from "react-markdown";

export default function ChatConversationPage() {
  const { selectedResources, removeResource } = useSelectedResources();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResourceSelectorOpen, setIsResourceSelectorOpen] = useState(false);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const { openAuthModal, isAuthenticated } = useAuth();
  const { fetchChat, messages, addMessage, doChat } = useChat();
  const [messageList, setMessageList] = useState<Message[] | null>(null);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      // TODO
      if (!isAuthenticated) {
        openAuthModal();
      }
      fetchChat(chatId);
    }
  }, [chatId]);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading || selectedResources?.length === 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      addMessage({ role: "user", content: message });
      const contentId = selectedResources[0]?.id?.toString();
      const result = await doChat(message, contentId, chatId);

      addMessage({ role: "assistant", content: result?.message });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage(
        `Failed to get response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto min-h-[calc(100vh-10rem)]">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <div className="mb-6 py-6">
            {messageList?.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-background-secondary mt-10"
                    : "bg-background-highlight"
                }`}
              >
                <div className="flex flex-col items-start gap-[14px]">
                  {message.role === "assistant" && <Logo />}
                  <div className="flex-1">
                    <p
                      className={`text-foreground ${
                        message.role === "user"
                          ? "text-lg font-bold"
                          : "text-base"
                      }`}
                    >
                      <ReactMarkdown>
                        {message.content || message.message}
                      </ReactMarkdown>
                    </p>
                  </div>
                </div>
                {message.role === "assistant" && selectedResources[0] && (
                  <div className="mt-6 flex flex-col gap-[14px] max-w-max">
                    <p className="text-sm font-bold">Resources</p>
                    <SelectedResourceCard
                      hideRemove
                      resource={selectedResources[0]}
                    />
                  </div>
                )}
              </div>
            ))}
            {isLoading && <TextLoading />}
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
    </div>
  );
}
