"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchAll, getAuthors, getResources } from "@/lib/api";
import PeopleCard from "@/components/PeopleCard";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ResourceSelectorProps, SearchResults } from "./search-modal-types";
import { ResourceCard } from "@/components/resource-card/ResourceCard";

export function SearchModal({
  open,
  onOpenChange,
  showWarning = false
}: ResourceSelectorProps) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      } catch (error) {
        console.error("Search failed:", error);
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
          const [defaultAuthors, defaultShows, defaultBooks, defaultEpisodes] =
            await Promise.all([
              getAuthors({ limit: 10 }),
              getResources({ type: "show", limit: 10 }),
              getResources({ type: "book", limit: 10 }),
              getResources({ type: "episode", limit: 10 })
            ]);
          setSearchResults({
            people: defaultAuthors?.people,
            shows: defaultShows.resources,
            books: defaultBooks.resources,
            episodes: defaultEpisodes.resources
          });
        } catch (error) {
          console.error("Failed to load default content:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadDefaultContent();
    }
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1299px] p-0 gap-0 bg-background">
        <ScrollArea>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-white/10 absolute right-4 top-4"
          >
            <CloseIcon className="h-5 w-5" />
          </Button>
          <div className="flex flex-col h-[85vh] max-w-[730px] m-auto">
            <div className="flex items-center gap-1 pt-11">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Search in resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-accent border border-white/10 pl-9 pr-4 py-2 w-full rounded-full text-white placeholder:text-muted-foreground h-[52px]"
                />
              </div>
            </div>

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
              <div className="py-12">
                {/* People Section */}
                {searchResults?.people?.length > 0 && (
                  <div className="group">
                    <h2 className="text-xl font-semibold text-white mb-6">
                      {search ? "Peoples" : "Popular Peoples"}
                    </h2>
                    <div className="relative w-full">
                      <Swiper spaceBetween={22} slidesPerView={5}>
                        {searchResults.people.map((people) => (
                          <SwiperSlide key={people.id}>
                            <PeopleCard people={people} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                )}

                {/* Shows Section */}
                {searchResults?.shows?.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold text-white mb-6 mt-12">
                      {search ? "Shows" : "Popular Shows"}
                    </h2>
                    <div className="relative w-full">
                      <Swiper spaceBetween={22} slidesPerView={5}>
                        {searchResults.shows.map((show) => (
                          <SwiperSlide key={show.id}>
                            <ResourceCard
                              key={show.id}
                              resource={show}
                              showDetails={false}
                              hideType={true}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </>
                )}

                {/* Episode Section */}
                {searchResults.episodes.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6 mt-12">
                      {search ? "Episodes" : "Popular Episodes"}
                    </h2>
                    <div className="relative w-full">
                      <Swiper spaceBetween={22} slidesPerView={5}>
                        {searchResults.episodes.map((resource) => (
                          <SwiperSlide key={resource.id}>
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              showDetails={false}
                              hideType={true}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </>
                )}

                {/* Book Section */}
                {searchResults.books.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6 mt-12">
                      {search ? "Books" : "Popular Books"}
                    </h2>
                    <div className="relative w-full">
                      <Swiper spaceBetween={22} slidesPerView={5}>
                        {searchResults.books.map((resource) => (
                          <SwiperSlide key={resource.id}>
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              showDetails={false}
                              hideType={true}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
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
