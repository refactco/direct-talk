'use client';

import { AuthorRequestModal } from '@/components/AuthorRequestModal';
import { PeopleCard } from '@/components/people-card/PeopleCard';
import { RequestAuthorCard } from '@/components/people-card/RequestAuthorCard';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthorRequest } from '@/contexts/AuthorRequestContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import type { PeopleCardListProps } from './people-card-list-type';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';

export function PeopleCardList({ people, isLoading }: PeopleCardListProps) {
  const { selectedResources } = useSelectedResources();
  const { isAuthenticated } = useAuth();
  const { hasRequestData } = useAuthorRequest();
  const hasSelectedAuthor = selectedResources.length > 0;
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleRequestAuthorClick = () => {
    setIsRequestModalOpen(true);
  };

  // Show skeleton cards while loading, or actual people + request card when loaded
  const displayItems = isLoading ? Array(4).fill(null) : people;
  const showRequestCard = !isLoading;
  const totalItems = showRequestCard
    ? displayItems.length + 1
    : displayItems.length;

  // Auto-scroll to selected author
  useEffect(() => {
    if (!api || isLoading || !selectedResources.length || !people.length) return;

    const selectedAuthor = selectedResources[0];
    const selectedIndex = people.findIndex(
      (person) => person.id === selectedAuthor.id
    );

    if (selectedIndex !== -1) {
      api.scrollTo(selectedIndex);
    }
  }, [api, selectedResources, people, isLoading]);

  // Track carousel state
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-open request modal when user logs in and has saved request data
  useEffect(() => {
    if (isAuthenticated && hasRequestData && !isRequestModalOpen) {
      // Small delay to ensure auth flow is complete
      const timer = setTimeout(() => {
        setIsRequestModalOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasRequestData, isRequestModalOpen]);

  return (
    <>
      <AuthorRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <div className="w-full space-y-4">
        {/* Main carousel */}
        <div className="relative px-12">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: 'start',
              loop: false,
              skipSnaps: false,
              dragFree: true
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {displayItems.map((person, index) => (
                <CarouselItem
                  key={person?.id || `skeleton-${index}`}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <PeopleCard
                    people={person}
                    isLoading={isLoading}
                    hasSelectedAuthor={hasSelectedAuthor}
                  />
                </CarouselItem>
              ))}
              {showRequestCard && (
                <CarouselItem
                  key="request-author"
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <RequestAuthorCard onClick={handleRequestAuthorClick} />
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Scroll indicators */}
        {!isLoading && totalItems > 1 && (
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === current - 1
                    ? 'bg-primary w-4'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
