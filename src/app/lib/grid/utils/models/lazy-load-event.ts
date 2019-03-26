import { IsGridSortMeta } from './sort-meta';
import { IsGridFilterMetadata } from './filter-metadata';

export interface IsGridLazyLoadEvent {
  first?: number;
  rows?: number;
  sortField?: string;
  sortOrder?: number;
  multiSortMeta?: IsGridSortMeta[];
  filters?: {[s: string]: IsGridFilterMetadata; };
  globalFilter?: string;
}
