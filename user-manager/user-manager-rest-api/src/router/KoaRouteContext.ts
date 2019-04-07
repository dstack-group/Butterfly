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
    return this.context.body;
  }

  /**
   * Sets the API response body and response status code.
   * @param body the data inserted into the returned body.
   * @param status the HTTP status code returned.
   */
  reply<T>(body: T, status = 200) {
    this.context.status = status;
    if (status === 204) {
      this.context.body = {};
    } else {
      this.context.body = { data: body };
      this.context.set('Content-Type', 'application/json');
    }
  }
}
