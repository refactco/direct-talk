export type ResourceType = "Article" | "Book" | "Podcast"

export interface Author {
  id: string
  name: string
  bio: string
  imageUrl: string
  resources: string[] // Resource IDs
}

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  imageUrl: string
  authorId: string
  topics: string[]
  publishedAt: string
  content?: string
  duration?: number // For podcasts/videos
  url?: string // External link if applicable
}

export interface Topic {
  id: string
  name: string
  description: string
  resourceCount: number
}

