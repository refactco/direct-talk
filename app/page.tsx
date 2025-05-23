'use client';

import { ChatInput } from '@/components/ChatInput';
import { PeopleCardListDesktop } from '@/components/people-card-list/desktop/people-card-list-desktop';
import InteractiveCirclesPeople from '@/components/people-card-list/mobile/InteractiveCircles';
import { PeopleCard } from '@/components/people-card/PeopleCard';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useInitialMessage } from '@/contexts/InitialMessageContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { IAuthor, IResource } from '@/types/resources';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [popularResources, setPopularResources] = useState<IAuthor[]>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<IAuthor | null>(null);
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(
    null
  );
  const { selectedResources, addResource, authorResourcesIds } =
    useSelectedResources();
  const { setInitialMessage } = useInitialMessage();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { updateStartChatDate } = useChat();
  const { toast } = useToast();
  let startMessage: any,
    startResources: any,
    startResourceIds: any,
    startAuthorResourcesIds: any;
  try {
    if (typeof window !== 'undefined') {
      startMessage = localStorage.getItem('startMessage');
      startResources = localStorage.getItem('startResources');
      startResourceIds = localStorage.getItem('startResourceIds');
      startAuthorResourcesIds = localStorage.getItem('startAuthorResourcesIds');
    }
  } catch (error) {
    console.error('localStorage is not available', error);
  }
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Failed to fetch content creators');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setPopularResources(data.people);
      } catch (err) {
        toast({
          variant: 'destructive',
          description:
            err instanceof Error
              ? err.message
              : 'Error fetching content creators'
        });
      } finally {
      }
    };

    fetchAuthors();
  }, []);

  // useEffect(() => {
  //   const fetchPopularResources = async () => {
  //     setIsLoadingPopular(true);
  //     try {
  //       const resources = await getResources({ sort: 'popular', limit: 5 });
  //       setPopularResources(resources?.resources);
  //     } catch (err) {
  //       const toastLimitConf: any = toastConfig({
  //         message:
  //           err instanceof Error
  //             ? err.message
  //             : 'Error fetching popular resources',
  //         toastType: 'destructive'
  //       });
  //       toast(toastLimitConf);
  //     } finally {
  //       setIsLoadingPopular(false);
  //     }
  //   };
  //   if (popularResources?.length > 0 && !popularResources[0]) {
  //     fetchPopularResources();
  //   }
  // }, []);

  useEffect(() => {
    if (
      isAuthenticated &&
      startMessage &&
      (startResourceIds || startAuthorResourcesIds)
    ) {
      if (startResources && JSON.parse(startResources).length > 0) {
        JSON.parse(startResources)?.map((el: IResource) => addResource(el));
      }

      const resourceIds = JSON.parse(startResourceIds);
      const authorResourceIds = JSON.parse(startAuthorResourcesIds);
      startNewChat(startMessage, [...authorResourceIds, ...resourceIds]);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (message: string) => {
    setErrorMessage(null);
    const contentIds: string[] = [];

    selectedResources.forEach((resource) => {
      const { ref_id } = resource;

      if (ref_id !== null && ref_id !== undefined && ref_id !== '') {
        contentIds.push(ref_id);
      }
    });

    if (!isAuthenticated) {
      localStorage.setItem('startMessage', message);
      localStorage.setItem('startResources', JSON.stringify(selectedResources));
      localStorage.setItem('startResourceIds', JSON.stringify(contentIds));
      localStorage.setItem(
        'startAuthorResourcesIds',
        JSON.stringify(authorResourcesIds)
      );

      openAuthModal();
      return;
    }

    if (message.trim()) {
      if (selectedResources.length > 0 || authorResourcesIds.length > 0) {
        await startNewChat(message, [...authorResourcesIds, ...contentIds]);
      } else {
        setIsModalOpen(true);
        setShowWarning(true);
      }
    }
  };

  const startNewChat = async (message: string, contentIds: string[]) => {
    if (contentIds.length > 0) {
      setIsLoading(true);
      updateStartChatDate(message, contentIds);
      setInitialMessage(message);
      router.push(`/conversation`);
      localStorage.removeItem('startMessage');
      localStorage.removeItem('startResources');
      localStorage.removeItem('startResourceIds');
      localStorage.removeItem('startAuthorResourcesIds');
    }
  };

  const handlePersonClick = (person: IAuthor, index: number | null) => {
    console.log({ person, index });
    if (selectedPerson?.id === person.id) {
      setSelectedPerson(null);
      setSelectedPersonIndex(null);
    } else {
      setSelectedPerson(person);
      setSelectedPersonIndex(index);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 justify-normal md:justify-center min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-4rem)] p-0 md:p-4">
      <div className="w-full max-w-3xl mt-0">
        <h1 className="text-2xl md:text-[2rem] font-semibold text-center text-white mb-4 sm:mb-12">
          Who do you want to talk to?
        </h1>
        {/* <InteractiveCircles /> */}
        {!popularResources ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {new Array(4).fill(null).map((show, index) => (
              <div key={index} className="justify-center items-center p-4">
                <div onClick={() => handlePersonClick(show, index)}>
                  <PeopleCard people={{} as any} isLoading />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <PeopleCardListDesktop
              selectedResources={selectedResources}
              selectedPerson={selectedPerson}
              popularResources={popularResources}
              selectedPersonIndex={selectedPersonIndex}
              handlePersonClick={handlePersonClick}
            />
            <InteractiveCirclesPeople
              selectedResources={selectedResources}
              selectedPerson={selectedPerson}
              popularResources={popularResources ?? []}
              selectedPersonIndex={selectedPersonIndex}
              handlePersonClick={handlePersonClick}
            />

            {/* <PeopleCardListMobile
              selectedResources={selectedResources}
              selectedPerson={selectedPerson}
              popularResources={popularResources}
              selectedPersonIndex={selectedPersonIndex}
              handlePersonClick={handlePersonClick}
            /> */}
          </>
        )}
      </div>

      <div
        className={cn(
          'w-full max-w-3xl flex flex-col justify-normal md:justify-center items-center transition-opacity duration-75',
          selectedPerson
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="w-full">
          <ChatInput
            onSubmit={handleSubmit}
            onAddResource={() => setIsModalOpen(true)}
            hideResources
            disabled={selectedResources.length === 0}
            // onRemoveResource={removeResource}
            // selectedResources={selectedResources}
            isLoading={isLoading}
            placeholder={
              selectedResources.length > 0 && 'name' in selectedResources[0]
                ? `I'm ${selectedResources[0].name}, ask me anything...`
                : 'Select an author to start'
            }
            defaultValue={startMessage ?? ''}
          />
        </div>
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      {/* <SearchModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setShowWarning(false);
        }}
        showWarning={showWarning}
      /> */}
    </div>
  );
}
