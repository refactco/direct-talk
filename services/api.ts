import type { Resource } from "@/types/resource"
import type { Topic } from "@/types/topic"

// Updated mockResources with new properties
const mockResources: Resource[] = [
  {
    id: "1",
    title: "The Innovator's Dilemma",
    author: "Clayton Christensen",
    type: "book",
    topics: ["business", "innovation", "technology"],
    summary: "A revolutionary business book that has changed corporate America forever.",
    image: "https://placehold.co/300x300/svg?text=Innovators+Dilemma",
    popularity: 95,
    new: false,
  },
  {
    id: "2",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    type: "book",
    topics: ["history", "anthropology", "science"],
    summary: "A groundbreaking narrative of humanity's creation and evolution.",
    image: "https://placehold.co/300x300/svg?text=Sapiens",
    popularity: 98,
    new: false,
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    type: "book",
    topics: ["self-help", "productivity", "psychology"],
    summary: "Tiny Changes, Remarkable Results: An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    image: "https://placehold.co/300x300/svg?text=Atomic+Habits",
    popularity: 92,
    new: false,
  },
  {
    id: "4",
    title: "The Lean Startup",
    author: "Eric Ries",
    type: "book",
    topics: ["business", "entrepreneurship", "innovation"],
    summary: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
    image: "https://placehold.co/300x300/svg?text=Lean+Startup",
    popularity: 88,
    new: false,
  },
  {
    id: "5",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    type: "book",
    topics: ["psychology", "decision-making", "behavioral economics"],
    summary: "A groundbreaking tour of the mind explaining the two systems that drive the way we think.",
    image: "https://placehold.co/300x300/svg?text=Thinking+Fast+and+Slow",
    popularity: 90,
    new: false,
  },
  {
    id: "6",
    title: "The Case for Reparations",
    author: "Ta-Nehisi Coates",
    type: "article",
    topics: ["history", "politics", "social justice"],
    summary: "An exploration of the moral and practical case for providing reparations to African Americans.",
    image: "https://placehold.co/300x300/svg?text=Case+for+Reparations",
    popularity: 85,
    new: true,
  },
  {
    id: "7",
    title: "The Really Big One",
    author: "Kathryn Schulz",
    type: "article",
    topics: ["science", "geology", "natural disasters"],
    summary: "An earthquake will destroy a sizable portion of the coastal Northwest. The question is when.",
    image: "https://placehold.co/300x300/svg?text=The+Really+Big+One",
    popularity: 82,
    new: true,
  },
  {
    id: "8",
    title: "The Moral Imperative for Bioethics",
    author: "Steven Pinker",
    type: "article",
    topics: ["ethics", "science", "medicine"],
    summary: "Biomedical research doesn't need more regulation. It needs more support.",
    image: "https://placehold.co/300x300/svg?text=Bioethics",
    popularity: 78,
    new: true,
  },
  {
    id: "9",
    title: "The Uninhabitable Earth",
    author: "David Wallace-Wells",
    type: "article",
    topics: ["climate change", "environment", "future"],
    summary: "Famine, economic collapse, a sun that cooks us: What climate change could wreak — sooner than you think.",
    image: "https://placehold.co/300x300/svg?text=Uninhabitable+Earth",
    popularity: 88,
    new: true,
  },
  {
    id: "10",
    title: "Serial",
    author: "Sarah Koenig",
    type: "podcast",
    topics: ["true crime", "journalism", "investigation"],
    summary: "Serial tells one story — a true story — over the course of a season.",
    image: "https://placehold.co/300x300/svg?text=Serial",
    popularity: 94,
    new: false,
  },
  {
    id: "11",
    title: "Radiolab",
    author: "Jad Abumrad & Robert Krulwich",
    type: "podcast",
    topics: ["science", "philosophy", "human experience"],
    summary:
      "Radiolab is a show about curiosity. Where sound illuminates ideas, and the boundaries blur between science, philosophy, and human experience.",
    image: "https://placehold.co/300x300/svg?text=Radiolab",
    popularity: 92,
    new: false,
  },
  {
    id: "12",
    title: "Hardcore History",
    author: "Dan Carlin",
    type: "podcast",
    topics: ["history", "war", "politics"],
    summary:
      'In "Hardcore History" journalist and broadcaster Dan Carlin takes his "Martian", unorthodox way of thinking and applies it to the past.',
    image: "https://placehold.co/300x300/svg?text=Hardcore+History",
    popularity: 89,
    new: false,
  },
  {
    id: "13",
    title: "Planet Money",
    author: "NPR",
    type: "podcast",
    topics: ["economics", "finance", "business"],
    summary:
      "The economy explained. Imagine you could call up a friend and say, \"Meet me at the bar and tell me what's going on with the economy.\" Now imagine that's actually a fun evening.",
    image: "https://placehold.co/300x300/svg?text=Planet+Money",
    popularity: 86,
    new: false,
  },
  {
    id: "14",
    title: "The Power of Vulnerability",
    author: "Brené Brown",
    type: "lecture",
    topics: ["psychology", "personal growth", "relationships"],
    summary: "Brené Brown studies human connection -- our ability to empathize, belong, love.",
    image: "https://placehold.co/300x300/svg?text=Power+of+Vulnerability",
    popularity: 91,
    new: false,
  },
  {
    id: "15",
    title: "The Danger of a Single Story",
    author: "Chimamanda Ngozi Adichie",
    type: "lecture",
    topics: ["culture", "literature", "stereotypes"],
    summary:
      "Our lives, our cultures, are composed of many overlapping stories. Novelist Chimamanda Adichie tells the story of how she found her authentic cultural voice.",
    image: "https://placehold.co/300x300/svg?text=Danger+of+Single+Story",
    popularity: 87,
    new: false,
  },
  {
    id: "16",
    title: "The Puzzle of Motivation",
    author: "Dan Pink",
    type: "lecture",
    topics: ["psychology", "business", "motivation"],
    summary:
      "Career analyst Dan Pink examines the puzzle of motivation, starting with a fact that social scientists know but most managers don't.",
    image: "https://placehold.co/300x300/svg?text=Puzzle+of+Motivation",
    popularity: 85,
    new: true,
  },
  {
    id: "17",
    title: "The Mathematics of Love",
    author: "Hannah Fry",
    type: "lecture",
    topics: ["mathematics", "relationships", "data science"],
    summary:
      "Finding the right mate is no cakewalk — but is it even mathematically likely? In a charming talk, mathematician Hannah Fry shows patterns in how we look for love.",
    image: "https://placehold.co/300x300/svg?text=Mathematics+of+Love",
    popularity: 83,
    new: true,
  },
  {
    id: "18",
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    type: "research",
    topics: ["artificial intelligence", "machine learning", "natural language processing"],
    summary:
      "This paper introduces the Transformer, a novel neural network architecture based on a self-attention mechanism.",
    image: "https://placehold.co/300x300/svg?text=Attention+Is+All+You+Need",
    popularity: 96,
    new: false,
  },
  {
    id: "19",
    title: "A Human-like Synthetic Promoter for Tunable Gene Expression",
    author: "Brown et al.",
    type: "research",
    topics: ["genetics", "synthetic biology", "gene expression"],
    summary:
      "This study presents a synthetic promoter that mimics human gene expression patterns, offering new possibilities for gene therapy and biotechnology.",
    image: "https://placehold.co/300x300/svg?text=Synthetic+Promoter",
    popularity: 80,
    new: true,
  },
  {
    id: "20",
    title: "Quantum Supremacy Using a Programmable Superconducting Processor",
    author: "Arute et al.",
    type: "research",
    topics: ["quantum computing", "computer science", "physics"],
    summary:
      "This paper reports the achievement of quantum supremacy, a milestone in quantum computing where a quantum device outperforms classical supercomputers.",
    image: "https://placehold.co/300x300/svg?text=Quantum+Supremacy",
    popularity: 93,
    new: false,
  },
  {
    id: "21",
    title: "A Global Assessment of Ocean Carbon Storage Change",
    author: "Gruber et al.",
    type: "research",
    topics: ["climate change", "oceanography", "carbon cycle"],
    summary:
      "This research provides a comprehensive analysis of changes in ocean carbon storage, crucial for understanding global climate change.",
    image: "https://placehold.co/300x300/svg?text=Ocean+Carbon+Storage",
    popularity: 84,
    new: true,
  },
  {
    id: "22",
    title: "The Economic Impacts of Climate Change",
    author: "Nordhaus and Moffat",
    type: "research",
    topics: ["economics", "climate change", "policy"],
    summary:
      "This paper reviews and synthesizes the literature on the economic impacts of climate change, providing insights for policy decisions.",
    image: "https://placehold.co/300x300/svg?text=Economic+Impacts+of+Climate+Change",
    popularity: 86,
    new: true,
  },
]

// Mock topics data
const mockTopics: Topic[] = [
  { id: "1", name: "Technology", resourceCount: 15 },
  { id: "2", name: "Science", resourceCount: 12 },
  { id: "3", name: "History", resourceCount: 8 },
  { id: "4", name: "Literature", resourceCount: 10 },
  { id: "5", name: "Philosophy", resourceCount: 6 },
  { id: "6", name: "Art", resourceCount: 7 },
  { id: "7", name: "Music", resourceCount: 9 },
  { id: "8", name: "Psychology", resourceCount: 11 },
]

export async function fetchPopularPeople(): Promise<Resource[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockResources
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5)
    .map((resource) => ({
      id: resource.id,
      name: resource.author,
      role: resource.type,
      imageUrl: resource.image,
    }))
}

export async function fetchPopularResources(): Promise<Resource[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockResources.sort((a, b) => b.popularity - a.popularity).slice(0, 5)
}

export async function fetchNewResources(): Promise<Resource[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockResources.filter((resource) => resource.new).slice(0, 5)
}

export async function fetchResources(query = "", type = "", offset = 0, limit = 15, topic = "") {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter resources based on query, type, and topics
  const filteredResources = mockResources.filter((resource) => {
    const matchesQuery =
      query === "" ||
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.author.toLowerCase().includes(query.toLowerCase()) ||
      resource.topics.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    const matchesType = type === "all" || type === "" || resource.type === type
    const matchesTopic = topic === "" || resource.topics.some((t) => t.toLowerCase() === topic.toLowerCase())
    return matchesQuery && matchesType && matchesTopic
  })

  // Get available types from filtered resources
  const availableTypes = [...new Set(filteredResources.map((resource) => resource.type))]

  // Apply offset and limit
  const paginatedResources = filteredResources.slice(offset, offset + limit)

  return {
    resources: paginatedResources,
    availableTypes: availableTypes,
  }
}

export async function fetchResourcesByAuthor(authorName: string): Promise<{ resources: Resource[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter resources based on author name
  const authorResources = mockResources.filter((resource) => resource.author.toLowerCase() === authorName.toLowerCase())

  return {
    resources: authorResources,
  }
}

export async function sendChatMessage(message, resourceIds) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find the first matching resource
  const citedResource = mockResources.find((resource) => resourceIds.includes(resource.id))

  // Mock response
  return {
    text: `This is a simulated response to your message: "${message}". It references the selected resources.`,
    citation: citedResource ? `From "${citedResource.title}" by ${citedResource.author}` : undefined,
  }
}

export async function fetchTopics(): Promise<Topic[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockTopics
}

export async function fetchAllAuthors(): Promise<{ name: string; image: string; resourceCount: number }[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const authorMap = new Map<string, { name: string; image: string; resourceCount: number }>()

  mockResources.forEach((resource) => {
    if (!authorMap.has(resource.author)) {
      authorMap.set(resource.author, {
        name: resource.author,
        image: resource.image,
        resourceCount: 1,
      })
    } else {
      const author = authorMap.get(resource.author)!
      author.resourceCount += 1
    }
  })

  return Array.from(authorMap.values())
}

export async function fetchAllPopularPeople(): Promise<Resource[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockResources
    .sort((a, b) => b.popularity - a.popularity)
    .map((resource) => ({
      id: resource.id,
      name: resource.author,
      role: resource.type,
      imageUrl: resource.image,
    }))
}

export async function fetchAllPopularResources(): Promise<Resource[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockResources.sort((a, b) => b.popularity - a.popularity)
}

export async function fetchAllNewResources(): Promise<Resource[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockResources.filter((resource) => resource.new)
}

