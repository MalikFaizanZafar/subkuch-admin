/**
 * Mock model. It is meant to be refactored/deleted in production.
 */
export interface Page<T> {
  page: number;
  size: number;
  total: number;
  data: T[];
}
