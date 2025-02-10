import type { Resource, Author, Topic } from "@/types/resources";

const API_BASE_URL = "https://dt-api.refact.co/wp-json/direct-talk/v1";

export async function getResources(params?: {
  type?: string;
  topic?: string;
  authorId?: string;
  query?: string;
  sort?: "popular" | "latest";
  limit?: number;
}): Promise<{ resources: Resource[] }> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);
  if (params?.topic) searchParams.set("topic", params.topic);
  if (params?.authorId) searchParams.set("author", params.authorId);
  if (params?.query) searchParams.set("s", params.query);
  if (params?.sort)
    searchParams.set(
      "orderby",
      params.sort === "popular" ? "popularity" : "date"
    );
  if (params?.limit) searchParams.set("per_page", params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/resources?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch resources");
  return response.json();
}

export async function getResource(id: string): Promise<Resource> {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`);
  if (!response.ok) throw new Error("Failed to fetch resource");
  return response.json();
}

export async function getAuthors(params?: {
  query?: string;
  limit?: number;
}): Promise<Author[]> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.set("s", params.query);
  if (params?.limit) searchParams.set("per_page", params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/people?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
}

export async function getAuthor(id: string): Promise<Author> {
  const response = await fetch(`${API_BASE_URL}/people/${id}`);
  if (!response.ok) throw new Error("Failed to fetch author");
  return response.json();
}

export async function getTopics(query?: string): Promise<Topic[]> {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set("s", query);

  const response = await fetch(`${API_BASE_URL}/topics?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch topics");
  return response.json();
}

export async function searchAll(query: string): Promise<{
  books: Resource[];
  people: Author[];
  shows: Resource[];
  episodes: Resource[];
}> {
  const response = await fetch(
    `${API_BASE_URL}/search?s=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error("Failed to search");
  const data = await response.json();

  return {
    books: data.books,
    people: data.people ?? [],
    shows: data.shows ?? [],
    episodes: data.episodes ?? [],
  };
}
