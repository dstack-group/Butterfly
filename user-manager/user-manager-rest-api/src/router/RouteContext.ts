/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RouteContext.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ValidateRoute } from './ValidateRoute';

/**
 * RouteContext defines the read-only contract that a wrapper for an HTTP framework's request's context
 * must follow.
 */
export interface RouteContext extends ValidateRoute {
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
