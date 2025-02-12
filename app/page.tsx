"use client";

import { useState, useEffect } from "react";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { useRouter } from "next/navigation";
import { getResources } from "@/lib/api";
import type { Resource } from "@/types/resources";
import { DetailSheet } from "@/components/DetailSheet";
import { ResourceCard } from "@/components/resource-card/ResourceCard";
import { SearchModal } from "@/components/search-modal/search-modal";
import { ChatInput } from "@/components/ChatInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [popularResources, setPopularResources] = useState<Resource[]>(
    Array.from({ length: 5 }).fill(null) as any
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isResourceSheetOpen, setIsResourceSheetOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(""); // Added state for current message
  const { selectedResources, removeResource } = useSelectedResources();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { doChat } = useChat();

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
      {/* Theme Toggle */}
      <ThemeToggle />
      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl sm:text-3xl md:text-[2rem] font-semibold text-center text-white mb-4 sm:mb-6">
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
        <div className="grid grid-cols-5 gap-[22px]">
          {popularResources?.map((resource, index: number) => (
            <ResourceCard
              key={index}
              resource={resource}
              isLoading={isLoadingPopular}
            />
          ))}
        </div>
      </div>

      <DetailSheet
        item={selectedResources[0]}
        open={isResourceSheetOpen}
        onOpenChange={setIsResourceSheetOpen}
      />
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
