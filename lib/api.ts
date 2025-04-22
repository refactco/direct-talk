import type { IAuthor, IResource, ITopic } from '@/types/resources';
import {
  IGetResourceEpisodesParams,
  IGetResourceEpisodesResponse
} from './api/api-type';
import { API_BASE_URL } from './constants';

export async function getResources(params?: {
  type?: string;
  topic?: string;
  authorId?: string;
  query?: string;
  sort?: 'popularity' | 'date';
  limit?: number;
}): Promise<{ resources: IResource[] }> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set('type', params.type);
  if (params?.topic) searchParams.set('topic', params.topic);
  if (params?.authorId) searchParams.set('author', params.authorId);
  if (params?.query) searchParams.set('s', params.query);
  if (params?.sort) searchParams.set('orderby', params.sort);
  if (params?.limit) searchParams.set('per_page', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/resources?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
}

export async function getResource(id: string): Promise<IResource> {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`);
  if (!response.ok) throw new Error('Failed to fetch resource');
  return response.json();
}

export async function getResourceEpisodes(
  params: IGetResourceEpisodesParams
): Promise<IGetResourceEpisodesResponse> {
  const { resourceId, pageNum = 1, perPage = 10 } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', pageNum.toString());
  searchParams.set('per_page', perPage.toString());

  const response = await fetch(
    `${API_BASE_URL}/resources/${resourceId}/episodes?${searchParams}`
  );
  if (!response.ok) throw new Error('Failed to fetch resource');
  return response.json();
}

export async function getAuthors(params?: {
  query?: string;
  limit?: number;
}): Promise<IAuthor[]> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set('s', params.query);
  if (params?.limit) searchParams.set('per_page', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/people?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch authors');
  return response.json();
}

export async function getAuthor(id: string): Promise<IAuthor> {
  const response = await fetch(`${API_BASE_URL}/people/${id}`);
  if (!response.ok) throw new Error('Failed to fetch author');
  return response.json();
}

export async function getTopics(query?: string): Promise<ITopic[]> {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('s', query);

  const response = await fetch(`${API_BASE_URL}/topics?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch topics');
  return response.json();
}

export async function searchAll(query: string): Promise<{
  books: IResource[];
  people: IAuthor[];
  shows: IResource[];
  episodes: IResource[];
}> {
  const response = await fetch(
    `${API_BASE_URL}/search?s=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('Failed to search');
  const data = await response.json();

  return {
    books: data.books,
    people: data.people ?? [],
    shows: data.shows ?? [],
    episodes: data.episodes ?? []
  };
}
