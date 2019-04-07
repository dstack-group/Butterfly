/**
 * RouteResponse is the structure of a success response of the REST endpoints.
 */
export interface RouteResponse<T> {
  /**
   * The entity returned after an HTTP request.
   */
  data: T | null;

  /**
   * The HTTP status code relative to the action processed by the REST server.
   */
  status?: number;
}
