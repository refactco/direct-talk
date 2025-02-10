export type ResourceType = "book" | "show" | "episode";

export interface Author {
  id: number | string;
  ref_id: number;
  name: string;
  description: string;
  image_url: string;
}

export interface Resource {
  id: number | string;
  ref_id: number;
  title: string;
  type: ResourceType;
  description: string;
  image_url: string;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}
