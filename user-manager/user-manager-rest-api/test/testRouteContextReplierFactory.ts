/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  testRouteContextReplierFactory.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { RouteContextReplier } from '../src/router/RouteContextReplier';

export const routeContextReplierFactory = (context: unknown): RouteContextReplier => {
  return new KoaRouteContext(context);
};
