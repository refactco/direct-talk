'use client';

import { AuthorRequestModal } from '@/components/AuthorRequestModal';
import { PeopleCard } from '@/components/people-card/PeopleCard';
import { RequestAuthorCard } from '@/components/people-card/RequestAuthorCard';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectedResources } from '@/contexts/SelectedResourcesContext';
import type { PeopleCardListProps } from './people-card-list-type';
import { useRef, useState, useEffect } from 'react';

export function PeopleCardList({ people, isLoading }: PeopleCardListProps) {
  const { selectedResources } = useSelectedResources();
  const { isAuthenticated, openAuthModal } = useAuth();
  const hasSelectedAuthor = selectedResources.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleRequestAuthorClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
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
    if (
      !scrollRef.current ||
      isLoading ||
      !selectedResources.length ||
      !people.length
    )
      return;

    const selectedAuthor = selectedResources[0];
    const selectedIndex = people.findIndex(
      (person) => person.id === selectedAuthor.id
    );

    if (selectedIndex !== -1) {
      scrollToIndex(selectedIndex);
    }
  }, [selectedResources, people, isLoading]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardElement = container.children[index] as HTMLElement;

    if (cardElement) {
      const containerWidth = container.clientWidth;
      const cardLeft = cardElement.offsetLeft;
      const cardWidth = cardElement.clientWidth;
      const scrollPosition = cardLeft - containerWidth / 2 + cardWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });

      setCurrentIndex(index);
    }
  };

  // Track scroll position for indicators
  const handleScroll = () => {
    if (!scrollRef.current || totalItems === 0) return;

    const container = scrollRef.current;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Find the card that's most centered
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const cardElement = child as HTMLElement;
      const cardCenter = cardElement.offsetLeft + cardElement.clientWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalItems]);

  return (
    <>
      <AuthorRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <div className="w-full space-y-4">
        {/* Main slider */}
        <div className="relative">
          {/* Peek shadows for visual indication */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {displayItems.map((person, index) => (
              <div
                key={person?.id || `skeleton-${index}`}
                className="flex-shrink-0 w-28 sm:w-32 md:w-36 lg:w-40"
                style={{ scrollSnapAlign: 'center' }}
              >
                <PeopleCard
                  people={person}
                  isLoading={isLoading}
                  hasSelectedAuthor={hasSelectedAuthor}
                />
              </div>
            ))}
            {showRequestCard && (
              <div
                key="request-author"
                className="flex-shrink-0 w-28 sm:w-32 md:w-36 lg:w-40"
                style={{ scrollSnapAlign: 'center' }}
              >
                <RequestAuthorCard onClick={handleRequestAuthorClick} />
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicators */}
        {!isLoading && totalItems > 1 && (
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
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
