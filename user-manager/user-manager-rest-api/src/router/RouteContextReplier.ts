/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RouteContextReplier.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { RouteContext } from './RouteContext';

/**
 * RouteContextReplier gives the possibility to reply to an HTTP request specifying
 * the data to be returned and the HTTP status code to be set.
 */
export interface RouteContextReplier extends RouteContext {
  /**
   * Sets the API response body and response status code.
   * @param data the data inserted into the returned body.
   * @param status the HTTP status code returned.
   */
  reply<T>(data: T, status?: number): void;
}
