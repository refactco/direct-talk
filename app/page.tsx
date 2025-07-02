'use client';

import { PeopleCardList } from '@/components/people-card-list/people-card-list';
import { ChatInput, type ChatInputRef } from '@/components/ChatInput';
import { Footer } from '@/components/Footer';
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
  const chatInputRef = useRef<ChatInputRef>(null);

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

  // Helper function to auto-focus and scroll to chat input on mobile landscape
  const autoFocusChatInput = () => {
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight;

    console.log('Auto-focus check:', {
      isMobile,
      isLandscape,
      width: window.innerWidth,
      height: window.innerHeight,
      hasSelectedAuthor,
      chatInputRef: !!chatInputRef.current
    });

    if (isMobile && isLandscape) {
      console.log('Triggering auto-focus for mobile landscape');
      // Small delay to ensure the chat input is rendered
      const timer = setTimeout(() => {
        // Scroll to the chat input first
        const chatContainer = document.querySelector('[data-chat-input]');
        console.log('Chat container found:', !!chatContainer);

        if (chatContainer) {
          chatContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // Then focus the input
          setTimeout(() => {
            console.log('Attempting to focus input');
            chatInputRef.current?.focus();
          }, 200);
        }
      }, 300);

      return timer;
    } else {
      // For testing on desktop - let's also trigger focus but without the mobile/landscape check
      console.log('Not mobile landscape, but focusing anyway for testing');
      const timer = setTimeout(() => {
        const chatContainer = document.querySelector('[data-chat-input]');
        if (chatContainer) {
          chatContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          setTimeout(() => {
            console.log('Focusing input on desktop for testing');
            chatInputRef.current?.focus();
          }, 200);
        }
      }, 300);

      return timer;
    }
  };

  // Auto-focus when author is selected or changed (regardless of authentication)
  useEffect(() => {
    if (!hasSelectedAuthor) return;

    const timer = autoFocusChatInput();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedResources]); // Changed from hasSelectedAuthor to selectedResources to trigger on author change

  // Auto-continue chat flow after login
  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigatedRef.current) return;

    // Check if user just logged in and has pending chat data
    if (
      isAuthenticated &&
      hasSelectedAuthor &&
      (initialMessage || startChatData?.message)
    ) {
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
  }, [
    isAuthenticated,
    hasSelectedAuthor,
    initialMessage,
    startChatData?.message
  ]);

  const handleChatSubmit = (message: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the chat state in existing contexts (they now persist to localStorage)
      console.log('Storing chat state before auth:', {
        message,
        selectedResources,
        authorResourcesIds
      });
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
    <div className="flex flex-col min-h-full overflow-x-hidden">
      {/* Main Content Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl px-4 min-w-0">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="font-bold text-2xl md:text-3xl text-foreground mb-2">
              Chat with Your Favorite Thinkers
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Answers are AI-generated from publicly available interviews.
            </p>
          </div>

          <div className="w-full overflow-x-hidden">
            <PeopleCardList people={people} isLoading={isLoading} />
          </div>

          {/* Chat Input - shows when an author is selected */}
          {hasSelectedAuthor && (
            <div className="mt-6 w-full" data-chat-input>
              <ChatInput
                ref={chatInputRef}
                onSubmit={handleChatSubmit}
                isLoading={false}
                placeholder={`Ask ${(selectedResources[0] as any)?.name || 'the selected author'} anything...`}
                disabled={false}
                defaultValue={initialMessage || startChatData?.message || ''}
              />
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
