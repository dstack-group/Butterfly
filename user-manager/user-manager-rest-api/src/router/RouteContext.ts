/**
 * RouteContext defines the read-only contract that a wrapper for an HTTP framework's request's context
 * must follow.
 */
export interface RouteContext {
  /**
   * Returns the URL params.
   */
  getNamedParams(): { [key: string]: string };

  /**
   * Returns the query params.
   */
  getQueryParams(): { [key: string]: string };

  /**
   * Returns the request body.
   */
  getRequestBody(): unknown;

  /**
   * Returns the request headers.
   */
  getRequestHeaders(): unknown;
}
