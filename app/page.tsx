"use client";

import { ChatInput } from "@/components/ChatInput";
import { ResourceCard } from "@/components/resource-card/ResourceCard";
import { SearchModal } from "@/components/search-modal/search-modal";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { getResources } from "@/lib/api";
import type { IResource } from "@/types/resources";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HistoryItem, useHistory } from "@/contexts/HistoryContext";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [popularResources, setPopularResources] = useState<IResource[]>(
    Array.from({ length: 5 }) as any
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(""); // Added state for current message
  const { selectedResources, removeResource } = useSelectedResources();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { doChat } = useChat();
  const { addHistoryItem } = useHistory();

  useEffect(() => {
    const fetchPopularResources = async () => {
      setIsLoadingPopular(true);
      try {
        const resources = await getResources({ sort: "popular", limit: 5 });
        setPopularResources(resources?.resources);
      } catch (error) {
        console.error("Error fetching popular resources:", error);
      } finally {
        setIsLoadingPopular(false);
      }
    };
    if (popularResources?.length > 0 && !popularResources[0]) {
      fetchPopularResources();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentMessage) {
      startNewChat(currentMessage);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (message: string) => {
    setErrorMessage(null);
    if (!isAuthenticated) {
      openAuthModal();
    }
    if (message.trim()) {
      setCurrentMessage(message);
      if (selectedResources.length > 0) {
        await startNewChat(message);
      } else {
        setIsModalOpen(true);
        setShowWarning(true);
      }
    }
  };

  const startNewChat = async (message: string) => {
    setIsLoading(true);
    try {
      const chatData = await doChat(
        message,
        selectedResources[0]?.id?.toString()
      );
      const historyItem: HistoryItem = {
        id: chatData.session_id,
        title: message,
        createdAt: new Date().toISOString(),
        contentId: selectedResources[0]?.id?.toString()
      };
      addHistoryItem(historyItem);
      router.push(`/chat/conversation?id=${chatData.session_id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      setErrorMessage(
        `Failed to create a new chat: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] p-4 sm:p-6">
      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl sm:text-3xl md:text-[2rem] font-semibold text-center text-white mb-4 sm:mb-6 mt-16 md:mt-0">
          What do you want to know?
        </h1>
        <div className="w-full">
          <ChatInput
            onSubmit={handleSubmit}
            onAddResource={() => setIsModalOpen(true)}
            onRemoveResource={removeResource}
            selectedResources={selectedResources}
            isLoading={isLoading}
            placeholder="Ask AI anything..."
          />
        </div>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-6 sm:mt-16">
        <h2 className="text-lg sm:text-xl md:text-xl font-semibold mb-6 text-center text-foreground">
          Popular resources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[22px]">
          {popularResources?.map((resource, index: number) => (
            <ResourceCard
              key={index}
              resource={resource}
              isLoading={isLoadingPopular}
            />
          ))}
        </div>
      </div>

      <SearchModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setShowWarning(false);
        }}
        showWarning={showWarning}
      />
    </div>
  );
}
