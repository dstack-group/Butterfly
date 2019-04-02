import { Context } from './Router';
import { RouteContextReplier } from '../modules/common/router/RouteContextReplier';

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
   * @param data the data inserted into the returned body.
   * @param status the HTTP status code returned.
   */
  reply<T>(data: T, status = 200) {
    this.context.body = { data };
    this.context.status = status;
  }
}
