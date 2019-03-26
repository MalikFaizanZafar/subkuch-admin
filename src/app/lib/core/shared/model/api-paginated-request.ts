/**
 * Class that represents a request to an API that returns paginated responses
 *
 * @export
 */
export class IsAPIPaginatedRequest {

  /**
   * Starting index from which results are to be obtained
   *
   * @memberof IsAPIPaginatedRequest
   */
  offset: number;

  /**
   * Maximum number of results that must be returned on a single page
   *
   * @memberof IsAPIPaginatedRequest
   */
  limit: number;

  /**
   * Optional arguments can be passed along with the response
   *
   * @memberof IsAPIPaginatedRequest
   */
  [propName: string]: any;
}
