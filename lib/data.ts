import type { Resource } from "@/types/resources";
import type { Author } from "@/types/resources";

export const resources: Resource[] = [
  {
    id: "potter",
    title: "Harry Potter and the Goblet of Fire",
    description:
      "The fourth book in the beloved Harry Potter series follows Harry through the Triwizard Tournament",
    type: "Book",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/harry.jpg-e6eALaqeEBW7tizBWdhiVK3nPFgLjQ.jpeg",
    authorId: "jk-rowling",
    topics: ["fantasy", "magic"],
    publishedAt: "1997-06-26"
  },
  {
    id: "01",
    title: "The Fabric of Reality",
    description:
      "An exploration of the nature of reality through quantum physics and philosophy",
    type: "Book",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fabrics.jpg-QYOOp6GtNxGXGfrOWPe7oiNYNuMF8N.jpeg",
    authorId: "david-deutsch",
    topics: ["science", "philosophy"],
    publishedAt: "2023-01-01"
  },
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    description:
      "A groundbreaking narrative of humanity's creation and evolution",
    type: "Book",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sepians.jpg-7iTqLoB5xl9cZN4VZmynGG6ifruXDn.jpeg",
    authorId: "yuval-noah-harari",
    topics: ["history", "anthropology"],
    publishedAt: "2011-01-01"
  },
  {
    id: "howls",
    title: "Howl's Moving Castle",
    description: "A fantasy novel by Diana Wynne Jones",
    type: "Book",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/howl.jpg-NR0H3MDBZEZnU2N5Wby9ZatBYTGiBj.jpeg",
    authorId: "diana-wynne-jones",
    topics: ["fantasy", "magic"],
    publishedAt: "1986-04-14"
  }
];

export const authors: Author[] = [
  {
    id: "jk-rowling",
    name: "J.K. Rowling",
    bio: "British author best known for the Harry Potter series",
    imageUrl: "/placeholder.svg?text=JKR",
    resources: ["potter"]
  },
  {
    id: "david-deutsch",
    name: "David Deutsch",
    bio: "Physicist and author known for his contributions to quantum computing",
    imageUrl: "/placeholder.svg?text=DD",
    resources: ["01"]
  },
  {
    id: "yuval-noah-harari",
    name: "Yuval Noah Harari",
    bio: "Israeli historian and author of 'Sapiens'",
    imageUrl: "/placeholder.svg?text=YNH",
    resources: ["sapiens"]
  },
  {
    id: "diana-wynne-jones",
    name: "Diana Wynne Jones",
    bio: "British author of fantasy novels, including 'Howl's Moving Castle'",
    imageUrl: "/placeholder.svg?text=DWJ",
    resources: ["howls"]
  }
];
