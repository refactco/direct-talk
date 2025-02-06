import type { Author, Resource, Topic } from "@/types/resources";
import { resources } from "./data";

export async function getResources(params?: {
  type?: string;
  topic?: string;
  authorId?: string;
  query?: string;
  sort?: "popular" | "latest";
  limit?: number;
}): Promise<Resource[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);
  if (params?.topic) searchParams.set("topic", params.topic);
  if (params?.authorId) searchParams.set("authorId", params.authorId);
  if (params?.query) searchParams.set("q", params.query);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const response = await fetch(`/api/resources?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch resources");
  return response.json();
}

export async function getResource(id: string): Promise<Resource> {
  const response = await fetch(`/api/resources/${id}`);
  if (!response.ok) throw new Error("Failed to fetch resource");
  return response.json();
}

export async function getAuthors(params?: {
  query?: string;
  limit?: number;
}): Promise<Author[]> {
  // Mock data for authors
  const mockAuthors: Author[] = [
    {
      id: "1",
      name: "J.K. Rowling",
      bio: "British author, best known for the Harry Potter series",
      imageUrl: "/placeholder.svg?text=JKR",
      resources: ["potter"]
    },
    {
      id: "2",
      name: "George Orwell",
      bio: "English novelist and essayist, author of '1984' and 'Animal Farm'",
      imageUrl: "/placeholder.svg?text=GO",
      resources: ["01"]
    },
    {
      id: "3",
      name: "Yuval Noah Harari",
      bio: "Israeli historian and author of 'Sapiens'",
      imageUrl: "/placeholder.svg?text=YNH",
      resources: ["sapiens"]
    }
  ];

  // Apply filtering and limiting if params are provided
  let filteredAuthors = [...mockAuthors];
  if (params?.query) {
    const lowercaseQuery = params.query.toLowerCase();
    filteredAuthors = filteredAuthors.filter(
      (author) =>
        author.name.toLowerCase().includes(lowercaseQuery) ||
        author.bio.toLowerCase().includes(lowercaseQuery)
    );
  }
  if (params?.limit) {
    filteredAuthors = filteredAuthors.slice(0, params.limit);
  }

  return filteredAuthors;
}

export async function getAuthor(
  id: string
): Promise<Author & { resources: Resource[] }> {
  const response = await fetch(`/api/authors/${id}`);
  if (!response.ok) throw new Error("Failed to fetch author");
  return response.json();
}

export async function getTopics(query?: string): Promise<Topic[]> {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set("q", query);

  const response = await fetch(`/api/topics?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch topics");
  return response.json();
}
