import { IResource } from "@/types/resources";

export interface IGetResourceEpisodesParams {
  resourceId: string;
  pageNum?: number;
  perPage?: number;
}

export interface IGetResourceEpisodesResponse {
  resources: IResource[];
  current_page: number;
  total: number;
  total_pages: number;
}
