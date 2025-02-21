'use client';

import { CardSlider } from '@/components/card-slider/card-slider';
import { ChatInput } from '@/components/ChatInput';
import { ResourceCard } from '@/components/resource-card/ResourceCard';
import { SearchModal } from '@/components/search-modal/search-modal';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { getResources } from '@/lib/api';
import type { IResource } from '@/types/resources';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SwiperSlide } from 'swiper/react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [popularResources, setPopularResources] = useState<IResource[]>(
    new Array(5).fill(null)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { selectedResources, removeResource, addResource } =
    useSelectedResources();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { doChat } = useChat();
  const { updateHistory } = useHistory();
  let startMessage: any, startResources: any, startResourceIds: any;
  try {
    if (typeof window !== 'undefined') {
      startMessage = localStorage.getItem('startMessage');
      startResources = localStorage.getItem('startResources');
      startResourceIds = localStorage.getItem('startResourceIds');
    }
  } catch (error) {
    console.error('localStorage is not available', error);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchPopularResources = async () => {
      setIsLoadingPopular(true);
      try {
        const resources = await getResources({ sort: 'popular', limit: 5 });
        setPopularResources(resources?.resources);
      } catch (error) {
        console.error('Error fetching popular resources:', error);
      } finally {
        setIsLoadingPopular(false);
      }
    };
    if (popularResources?.length > 0 && !popularResources[0]) {
      fetchPopularResources();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && startMessage && startResourceIds) {
      if (startResources && JSON.parse(startResources).length > 0) {
        JSON.parse(startResources)?.map((el: IResource) => addResource(el));
      }
      startNewChat(startMessage, JSON.parse(startResourceIds));
    }
  }, [isAuthenticated]);

  const handleSubmit = async (message: string) => {
    setErrorMessage(null);
    const contentIds: string[] = selectedResources
      .map((resource) => resource.ref_id)
      .filter(
        (ref_id) => ref_id !== '' && ref_id !== null && ref_id !== undefined
      );

    if (!isAuthenticated) {
      localStorage.setItem('startMessage', message);
      localStorage.setItem('startResources', JSON.stringify(selectedResources));
      localStorage.setItem('startResourceIds', JSON.stringify(contentIds));
      openAuthModal();
      return;
    }
    if (message.trim()) {
      if (selectedResources.length > 0) {
        await startNewChat(message, contentIds);
      } else {
        setIsModalOpen(true);
        setShowWarning(true);
      }
    }
  };

  const startNewChat = async (message: string, contentIds: string[]) => {
    setIsLoading(true);
    try {
      if (contentIds.length > 0) {
        const chatData = await doChat(message, contentIds);
        updateHistory();
        router.push(`/conversation?id=${chatData.session_id}`);
        localStorage.removeItem('startMessage');
        localStorage.removeItem('startResources');
        localStorage.removeItem('startResourceIds');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      setErrorMessage(
        `Failed to create a new chat: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center gap-16 md:gap-16 justify-normal md:justify-center min-h-[calc(100vh-4rem)] p-0 md:p-4">
      <div className="w-full max-w-3xl flex flex-col justify-normal md:justify-center items-center">
        <h1 className="text-2xl md:text-[2rem] font-semibold text-center text-white mb-4 sm:mb-6 mt-28 md:mt-0">
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
            defaultValue={startMessage ?? ''}
          />
        </div>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-0">
        <h2 className="text-lg sm:text-xl md:text-xl font-semibold mb-6 text-center text-foreground">
          Popular resources
        </h2>
        {isMounted ? (
          <CardSlider>
            {popularResources.map((show, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <ResourceCard resource={show} isLoading={isLoadingPopular} />
              </SwiperSlide>
            ))}
          </CardSlider>
        ) : null}
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
