'use client';

import { PeopleCard } from '@/components/people-card/PeopleCard';
import { ResourceCard } from '@/components/resource-card/ResourceCard';
import { SearchResultSection } from '@/components/search/SearchResultSection';
import { TopResult } from '@/components/search/TopResult';
import { useSearch } from '@/contexts/SearchContext';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SearchPage({ params }: { params: { query: string } }) {
  const { query, setQuery, results } = useSearch();
  const decodedQuery = decodeURIComponent(params.query);

  useEffect(() => {
    if (decodedQuery !== query) {
      setQuery(decodedQuery);
    }
  }, [decodedQuery, query, setQuery]);

  if (!query || query.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Search className="w-16 h-16 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Start your search</h2>
        <p className="text-muted-foreground">
          Enter a keyword in the search bar above to find resources, authors,
          and topics.
        </p>
      </div>
    );
  }

  const topResult = results.resources[0];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {topResult && (
          <div>
            <h2 className="mb-4 text-2xl font-bold">Top result</h2>
            <TopResult resource={topResult} />
          </div>
        )}

        {results.resources.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold">Resources</h2>
            <div className="rounded-md bg-background-highlight">
              {results.resources.slice(0, 4).map((resource) => (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-background-secondary"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                    <img
                      src={resource.imageUrl || '/placeholder.svg'}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{resource.title}</div>
                    <div className="truncate text-sm text-muted-foreground">
                      {resource.type} • {resource.authorId}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {results.authors.length > 0 && (
        <SearchResultSection title="Authors" viewAllHref="/authors">
          {results.authors.map((author) => (
            <PeopleCard key={author.id} people={author} />
          ))}
        </SearchResultSection>
      )}

      {results.resources.length > 0 && (
        <SearchResultSection title="Resources" viewAllHref="/resources">
          {results.resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </SearchResultSection>
      )}

      {results.topics.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">Topics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="flex items-center gap-4 rounded-md bg-background-highlight p-4 transition-colors hover:bg-background-secondary"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {topic.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {topic.resourceCount} resources
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
