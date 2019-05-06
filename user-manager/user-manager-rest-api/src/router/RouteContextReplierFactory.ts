/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RouteContextReplierFactory.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { RouteContextReplier } from './RouteContextReplier';
import { Context } from './Router';

/**
 * A RouteContextReplierFactory must be able to create an implementation of RouteContextReplier
 * given a router context.
 */
export type RouteContextReplierFactory = (context: Context) => RouteContextReplier;
