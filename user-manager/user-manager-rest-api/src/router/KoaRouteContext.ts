import { Context } from './Router';
import { RouteContextReplier } from './RouteContextReplier';

/**
 * KoaRouteContext is a RouteContextReplier implementation based on the Koa framework's
 * HTTP request router context.
 */
export class KoaRouteContext implements RouteContextReplier {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  /**
   * Returns the URL params.
   */
  getNamedParams() {
    return this.context.params;
  }

  /**
   * Returns the query params.
   */
  getQueryParams() {
    return this.context.query;
  }

  /**
   * Returns the request body.
   */
  getRequestBody() {
    return this.context.request.body;
  }

  /**
   * Returns the request headers.
   */
  getRequestHeaders(): unknown {
    return this.context.request.headers;
  }

  /**
   * Sets the API response body and response status code.
   * @param body the data inserted into the returned body.
   * @param status the HTTP status code returned.
   */
  reply<T>(body: T, status = 200) {
    this.context.status = status;
    if (status === 204) { // NO_CONTENT
      this.context.body = {};
    } else {
      const isError = status >= 400;

      /**
       * If we're in an error situation, a complete error object has already been built
       * by `errorHandler`, and we must simply return it as it is.
       * If, instead, the response is a successful one, it must be set as the value for the
       * `data` top-level key.
       */
      this.context.body = isError ? body : { data: body };
      this.context.set('Content-Type', 'application/json');
    }
  }
}
