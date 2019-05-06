/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RouteResponse.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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
