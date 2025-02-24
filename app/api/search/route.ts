import { authors, resources } from '@/lib/mocked/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  // If no query, return default results
  if (!query.trim()) {
    const defaultAuthors = authors.slice(0, 5);
    const defaultShows = resources
      .filter((r) => r.type === 'Podcast')
      .slice(0, 5);
    const defaultBooks = resources.filter((r) => r.type === 'Book').slice(0, 5);

    return NextResponse.json({
      resources: defaultBooks,
      authors: defaultAuthors,
      shows: defaultShows,
      total: defaultAuthors.length + defaultShows.length + defaultBooks.length
    });
  }

  // Filter resources based on query
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query)
  );

  // Filter authors based on query
  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(query) ||
      author.bio.toLowerCase().includes(query)
  );

  // Filter shows (assuming shows are resources with type "Podcast")
  const filteredShows = resources.filter(
    (resource) =>
      resource.type === 'Podcast' &&
      (resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query))
  );

  return NextResponse.json({
    resources: filteredResources.filter((r) => r.type !== 'Podcast'),
    authors: filteredAuthors,
    shows: filteredShows,
    total:
      filteredResources.length + filteredAuthors.length + filteredShows.length
  });
}
