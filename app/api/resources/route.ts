import { resources } from '@/lib/mocked/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const topic = searchParams.get('topic');
  const authorId = searchParams.get('authorId');
  const query = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort');
  const limit = searchParams.get('limit')
    ? Number.parseInt(searchParams.get('limit')!)
    : undefined;

  let filteredResources = [...resources];

  if (type) {
    filteredResources = filteredResources.filter(
      (resource) => resource.type === type
    );
  }

  if (topic) {
    filteredResources = filteredResources.filter((resource) =>
      resource.topics.includes(topic)
    );
  }

  if (authorId) {
    filteredResources = filteredResources.filter(
      (resource) => resource.authorId === authorId
    );
  }

  if (query) {
    filteredResources = filteredResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)
    );
  }

  if (sort === 'popular') {
    filteredResources.sort((a, b) => b.id.localeCompare(a.id)); // This is a placeholder sorting logic
  } else if (sort === 'latest') {
    filteredResources.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  if (limit) {
    filteredResources = filteredResources.slice(0, limit);
  }

  return NextResponse.json(filteredResources);
}
