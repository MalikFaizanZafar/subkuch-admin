/**
 * Class that represents a response from an API with paginated results.
 * This contract is based upong the Trilogy's L1 API Guidelines Spec
 *
 * @export
 */
export class IsAPIPaginatedResponse<T> {

  /**
   * Total number of records in the database
   * @memberof IsAPIPaginatedResponse
   */
  total: number;

  /**
   * List of objects to be rendered in the page
   * @memberof IsAPIPaginatedResponse
   */
  contents: T[];

  /**
   * URL to the page of the collection
   * @memberof IsAPIPaginatedResponse
   */
  self: string;

  /**
   * Identifies the type of the resource returned.
   * For paginated responses it is always 'Page'.
   * @memberof IsAPIPaginatedResponse
   */
  kind: string = 'Page';

  /**
   * URL to the root collection (e.g. /repositories)
   * @memberof IsAPIPaginatedResponse
   */
  pageOf: string;

  /**
   * URL to the next page of results (if it exists)
   * @memberof IsAPIPaginatedResponse
   */
  prev: string;

  /**
   * URL to the previous page of results (if it exists)
   * @memberof IsAPIPaginatedResponse
   */
  next: string;
}
