/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RouteCommand.ts
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
import { RouteResponse } from './RouteResponse';

/**
 * A RouteCommand, given a framework-independent HTTP request context object, performs an asynchronous
 * computation and returns its result, also specifying the proper HTTP status code to be returned.
 */
export type RouteCommand<T> = (routeContext: RouteContext) => Promise<RouteResponse<T>>;
