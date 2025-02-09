"use client";

import { useState, useEffect } from "react";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { useRouter } from "next/navigation";
import { getResources } from "@/lib/api";
import { createNewChat } from "@/lib/history-storage";
import type { Resource } from "@/types/resources";
import { DetailSheet } from "@/components/DetailSheet";
import { HomeResourceCard } from "@/components/HomeResourceCard";
import { ResourceSelector } from "@/components/ResourceSelector";
import { AuthModal } from "@/components/AuthModal";
import { ChatInput } from "@/components/ChatInput";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [popularResources, setPopularResources] = useState<Resource[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResourceSheetOpen, setIsResourceSheetOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(""); // Added state for current message
  const { selectedResources, removeResource, addResource } =
    useSelectedResources();
  const router = useRouter();

  useEffect(() => {
    const fetchPopularResources = async () => {
      try {
        const resources = await getResources({ sort: "popular", limit: 4 });
        setPopularResources(resources);
      } catch (error) {
        console.error("Error fetching popular resources:", error);
      }
    };
    fetchPopularResources();
  }, []);

  const handleSubmit = async (message: string) => {
    setErrorMessage(null);
    if (message.trim()) {
      setCurrentMessage(message); // Update: Store the message
      if (selectedResources.length > 0) {
        console.log("Attempting to open AuthModal");
        setIsAuthModalOpen(true);
      } else {
        // setIsModalOpen(true);
        setShowWarning(true);
      }
    }
  };

  const handleAuthenticated = async () => {
    setIsAuthModalOpen(false);
    setIsLoading(true);
    try {
      const chatId = await createNewChat(
        selectedResources[0].id,
        currentMessage
      ); // Update: Use stored message
      router.push(`/chat/conversation?id=${chatId}`);
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
        {showWarning && selectedResources.length === 0 && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm">
            Please select at least one resource before starting a chat.
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-6 sm:mt-16">
        <h2 className="text-lg sm:text-xl md:text-xl font-semibold mb-6 text-center text-foreground">
          Popular resources
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-[22px]">
          {popularResources.map((resource) => (
            <HomeResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      <DetailSheet
        item={selectedResources[0]}
        open={isResourceSheetOpen}
        onOpenChange={setIsResourceSheetOpen}
      />
      <ResourceSelector
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setShowWarning(false);
        }}
        showWarning={showWarning}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          console.log("Closing AuthModal");
          setIsAuthModalOpen(false);
        }}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}
