import type { IAuthor, IResource } from "@/types/resources";

export const resources: IResource[] = [
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
  },
  {
    id: "ted-radio-hour",
    title: "TED Radio Hour",
    description:
      "A journey through fascinating ideas, astonishing inventions, and new ways to think and create.",
    type: "Podcast",
    imageUrl: "/placeholder.svg?text=TRH",
    authorId: "npr",
    topics: ["technology", "science", "culture"],
    publishedAt: "2012-04-27"
  },
  {
    id: "hardcore-history",
    title: "Hardcore History",
    description:
      "In-depth, long-form podcasts about history's most dramatic events.",
    type: "Podcast",
    imageUrl: "/placeholder.svg?text=HH",
    authorId: "dan-carlin",
    topics: ["history", "war", "politics"],
    publishedAt: "2006-10-30"
  },
  {
    id: "radiolab",
    title: "Radiolab",
    description:
      "A show about curiosity. Where sound illuminates ideas, and the boundaries blur between science, philosophy, and human experience.",
    type: "Podcast",
    imageUrl: "/placeholder.svg?text=RL",
    authorId: "wnyc-studios",
    topics: ["science", "philosophy", "human experience"],
    publishedAt: "2002-05-24"
  }
];

export const authors: IAuthor[] = [
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
  },
  {
    id: "npr",
    name: "NPR",
    bio: "National Public Radio, producer of various podcasts including TED Radio Hour",
    imageUrl: "/placeholder.svg?text=NPR",
    resources: ["ted-radio-hour"]
  },
  {
    id: "dan-carlin",
    name: "Dan Carlin",
    bio: "American podcaster and political commentator, known for Hardcore History",
    imageUrl: "/placeholder.svg?text=DC",
    resources: ["hardcore-history"]
  },
  {
    id: "wnyc-studios",
    name: "WNYC Studios",
    bio: "New York Public Radio's podcast production arm, creators of Radiolab",
    imageUrl: "/placeholder.svg?text=WNYC",
    resources: ["radiolab"]
  }
];

export const topics = [
  {
    name: "",
    description: ""
  }
];
