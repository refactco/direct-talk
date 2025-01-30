import type { Resource } from "@/types/resources"

export const resources: Resource[] = [
  {
    id: "potter",
    title: "Harry Potter",
    description: "The famous wizarding world series by J.K. Rowling",
    type: "Book",
    imageUrl: "/placeholder.svg?text=HP",
    authorId: "J.K. Rowling",
    topics: ["fantasy", "magic"],
    publishedAt: "1997-06-26",
  },
  {
    id: "01",
    title: "Fabrics of Reality",
    description: "An exploration of the nature of reality",
    type: "Book",
    imageUrl: "/placeholder.svg?text=FR",
    authorId: "Unknown",
    topics: ["science", "philosophy"],
    publishedAt: "2023-01-01",
  },
  {
    id: "sapiens",
    title: "Sapiens",
    description: "A brief history of humankind by Yuval Noah Harari",
    type: "Book",
    imageUrl: "/placeholder.svg?text=S",
    authorId: "Yuval Noah Harari",
    topics: ["history", "anthropology"],
    publishedAt: "2011-01-01",
  },
  {
    id: "howls",
    title: "Howl's Moving Castle",
    description: "A fantasy novel by Diana Wynne Jones",
    type: "Book",
    imageUrl: "/placeholder.svg?text=HMC",
    authorId: "Diana Wynne Jones",
    topics: ["fantasy", "magic"],
    publishedAt: "1986-04-14",
  },
]

