'use client';

import { CardSlider } from '@/components/card-slider/card-slider';
import { ResourceCard } from '@/components/resource-card/ResourceCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuthors, getResources, searchAll } from '@/lib/api';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import 'swiper/css';
import { SwiperSlide } from 'swiper/react';
import { PeopleCard } from '../people-card/PeopleCard';
import { SelectedResourcesList } from '../selected-resources-list/selected-resources-list';
import { ResourceSelectorProps, SearchResults } from './search-modal-types';
import toastConfig from "@/lib/toast-config";
import {useToast} from "@/hooks/use-toast";

export function SearchModal({
  open,
  onOpenChange,
  showWarning = false
}: ResourceSelectorProps) {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<SearchResults>({
    people: [],
    shows: [],
    books: [],
    episodes: []
  });

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      try {
        const results = await searchAll(search);
        setSearchResults(results);
      } catch (err) {
        const toastLimitConf: any = toastConfig({
          message: err instanceof Error ? err.message : 'Search failed',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
        setSearchResults({
          people: [],
          shows: [],
          books: [],
          episodes: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (search.trim()) {
      const debounceTimer = setTimeout(performSearch, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      // Load default content when there's no search query
      const loadDefaultContent = async () => {
        setIsLoading(true);
        try {
          const [defaultAuthors, defaultShows] =
            await Promise.all([
              getAuthors({ limit: 10 }),
              getResources({  limit: 10 }),
            ]);
          setSearchResults({
            people: defaultAuthors?.people,
            shows: defaultShows.resources,
          });
        } catch (err) {
          const toastLimitConf: any = toastConfig({
            message: err instanceof Error ? err.message : 'Failed to load default content',
            toastType: 'destructive'
          });
          toast(toastLimitConf);
        } finally {
          setIsLoading(false);
        }
      };
      loadDefaultContent();
    }
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[1299px] h-full md:max-h-[811px] p-0 gap-0 bg-background ring-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="rounded-full border border-border absolute right-4 top-4 h-10 w-10"
        >
          <X className="w-5 h-5" />
          {/* <CloseIcon className="fill-white" /> */}
        </Button>
        <div className="flex flex-col w-full max-w-[360px] md:max-w-[730px] m-auto gap-6">
          <div className="flex items-center gap-1 mt-20 md:mt-11">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search in resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-accent border border-border pl-9 pr-4 py-2 w-full rounded-full placeholder:text-muted-foreground h-[52px]"
              />
            </div>
          </div>
          <div className="mb-6">
            <SelectedResourcesList />
          </div>
        </div>
        <ScrollArea className="hello-world">
          <div className="flex flex-col h-full md:h-[71vh] w-full md:w-auto max-w-[360px] md:max-w-[730px] m-auto">
            {/* Content Area */}
            {showWarning && (
              <Alert variant="warning" className="my-6 rounded-full">
                <AlertDescription>
                  Please select at least one resource before starting a chat.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" />
              </div>
            )}

            {/* Search Results or Default Content */}
            {!isLoading && (
              <div className="py-6">
                {/* People Section */}
                {searchResults?.people?.length > 0 && (
                  <div className="group">
                    <h2 className="text-xl font-semibold text-white mb-6">
                      {search ? 'Peoples' : 'Popular Peoples'}
                    </h2>
                    <CardSlider spaceBetween={22.08}>
                      {searchResults.people.map((people) => (
                        <SwiperSlide key={people.id}>
                          <PeopleCard people={people} />
                        </SwiperSlide>
                      ))}
                    </CardSlider>
                  </div>
                )}

                {/* Shows Section */}
                {searchResults?.shows?.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold text-white mb-6 mt-12">
                      {search ? 'Shows' : 'Popular Resources'}
                    </h2>
                    <CardSlider>
                      {searchResults.shows.map((show) => (
                        <SwiperSlide key={show.id}>
                          <ResourceCard
                            key={show.id}
                            resource={show}
                            hideType={true}
                          />
                        </SwiperSlide>
                      ))}
                    </CardSlider>
                  </>
                )}

                {/* Episode Section */}
                {search && searchResults.episodes.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6 mt-12">
                      Episodes
                    </h2>
                    <div className="relative w-full">
                      <CardSlider>
                        {searchResults.episodes.map((resource) => (
                          <SwiperSlide key={resource.id}>
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              hideType={true}
                            />
                          </SwiperSlide>
                        ))}
                      </CardSlider>
                    </div>
                  </>
                )}

                {/* Book Section */}
                {search && searchResults.books.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6 mt-12">
                      Books
                    </h2>
                    <div className="relative w-full">
                      <CardSlider>
                        {searchResults.books.map((resource) => (
                          <SwiperSlide key={resource.id}>
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              hideType={true}
                              showDetails
                            />
                          </SwiperSlide>
                        ))}
                      </CardSlider>
                    </div>
                  </>
                )}

                {/* No Results Message */}
                {search.trim() &&
                  searchResults.people.length === 0 &&
                  searchResults.shows.length === 0 &&
                  searchResults.episodes.length === 0 &&
                  searchResults.books.length === 0 && (
                    <div className="text-center text-neutral-400 py-8">
                      No results found for "{search}"
                    </div>
                  )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
