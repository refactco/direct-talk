import { resources } from '@/lib/data';
import { NextResponse } from 'next/server';

// Function to check if it's running in a proper request context
const isRequestContext = (request: Request): boolean => {
  return typeof request.url === 'string' && request.url.startsWith('http');
};

export async function GET(request: Request) {
  let baseUrl = '';

  if (isRequestContext(request)) {
    // If we are in a request context, we can safely parse the URL
    baseUrl = `${new URL(request.url).protocol}//${
      new URL(request.url).hostname
    }${new URL(request.url).port ? `:${new URL(request.url).port}` : ''}`;
  } else {
    // Otherwise, fallback to an empty string or provide a fallback URL (could be localhost or your deployment base URL)
    baseUrl = 'http://localhost:3000'; // Update this based on your production setup
  }

  const { searchParams } = new URL(request.url, baseUrl);

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
    filteredResources.sort((a, b) => b.id.localeCompare(a.id)); // Placeholder sorting logic
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
