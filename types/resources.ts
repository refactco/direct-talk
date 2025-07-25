export type ResourceType = 'book' | 'show' | 'episode';

export interface IBaseResourceItem {
  id: number | string;
  ref_id: string | null;
  description: string;
  image_url: string;
}

export interface IResource extends IBaseResourceItem {
  title: string;
  type: ResourceType;
  people?: IAuthor[];
  episodes: IResource[];
}

export interface IAuthorResources<T> {
  books: T;
  shows: T;
  episodes: T;
}

export interface IAuthor extends IBaseResourceItem {
  name: string;
  resources: {
    items: IAuthorResources<IResource[]>;
    total: IAuthorResources<number>;
  };
}

export type TSelectedResource = IResource | IAuthor;
