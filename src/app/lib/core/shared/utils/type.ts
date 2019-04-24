/**
 * Context type for embedded views
 */
export interface IsImplicitContext<T> {
  /**
   * Implicit context of embedded view
   * of 'T' type
   */
  $implicit: T;
}
