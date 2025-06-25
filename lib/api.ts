import type { IAuthor } from '@/types/resources';

export async function getAuthor(id: string): Promise<IAuthor> {
  const response = await fetch(`/api/people/${id}`);
  if (!response.ok) throw new Error('Failed to fetch author');
  return response.json();
}
