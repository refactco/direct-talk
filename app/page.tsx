'use client';

import { PeopleCardListDesktop } from '@/components/people-card-list/desktop/people-card-list-desktop';
import { PeopleCardListMobile } from '@/components/people-card-list/mobile/people-card-list-mobile';
import { ChatInput } from '@/components/ChatInput';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useInitialMessage } from '@/contexts/InitialMessageContext';
import type { IAuthor } from '@/types/resources';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [people, setPeople] = useState<IAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedResources, authorResourcesIds } = useSelectedResources();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { updateStartChatDate, startChatData } = useChat();
  const { setInitialMessage, initialMessage } = useInitialMessage();
  const router = useRouter();
  const hasNavigatedRef = useRef(false);

  const hasSelectedAuthor = selectedResources.length > 0;

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Failed to fetch content creators');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setPeople(data.people);
      } catch (err) {
        console.error('Error fetching content creators:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  // Auto-continue chat flow after login
  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigatedRef.current) return;
    
    // Check if user just logged in and has pending chat data
    if (isAuthenticated && hasSelectedAuthor && (initialMessage || startChatData?.message)) {
      const messageToUse = initialMessage || startChatData?.message;
      const contentIds = startChatData?.contentIds || authorResourcesIds;
      
      console.log('Auto-continuing chat after login:', { 
        messageToUse, 
        contentIds, 
        selectedResourcesCount: selectedResources.length,
        isAuthenticated,
        hasSelectedAuthor 
      });
      
      // Mark as navigated to prevent multiple runs
      hasNavigatedRef.current = true;
      
      // Add a small delay to ensure all contexts are fully loaded
      const timer = setTimeout(() => {
        if (messageToUse) {
          console.log('Navigating to conversation with message:', messageToUse);
          setInitialMessage(messageToUse);
          updateStartChatDate(messageToUse, contentIds as string[]);
          
          // Navigate to conversation page
          router.push('/conversation');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasSelectedAuthor, initialMessage, startChatData?.message]);

  const handleChatSubmit = (message: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the chat state in existing contexts (they now persist to localStorage)
      console.log('Storing chat state before auth:', { message, selectedResources, authorResourcesIds });
      setInitialMessage(message);
      updateStartChatDate(message, authorResourcesIds as string[]);
      openAuthModal();
      return;
    }

    // Set the initial message and selected resources for the chat
    setInitialMessage(message);
    // Use the authorResourcesIds which contain the ref_ids that the API expects
    updateStartChatDate(message, authorResourcesIds as string[]);
    
    // Navigate to conversation page
    router.push('/conversation');
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 justify-normal md:justify-center min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-6 sm:mb-12 px-4 md:px-0">
          <h1 className="font-bold text-2xl md:text-3xl text-center text-foreground mb-2">
            Chat with Your Favorite Thinkers
          </h1>
        </div>
        
        <div className="hidden md:block">
          <PeopleCardListDesktop people={people} isLoading={isLoading} />
        </div>
        
        <PeopleCardListMobile people={people} isLoading={isLoading} />
        
        {/* Chat Input - shows when an author is selected */}
        {hasSelectedAuthor && (
          <div className="mt-8 w-full">
            <ChatInput
              onSubmit={handleChatSubmit}
              isLoading={false}
              placeholder={`Ask ${(selectedResources[0] as any)?.name || 'the selected author'} anything...`}
              disabled={!hasSelectedAuthor}
              defaultValue={initialMessage || startChatData?.message || ''}
            />
          </div>
        )}
      </div>
    </div>
  );
}
