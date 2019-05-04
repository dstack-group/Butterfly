/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RouteController.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { createRouteCommandHandler, RouteCommandHandler } from '../../router/RouteCommandHandler';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { RouteCommand } from '../../router/RouteCommand';

/**
 * Base class for the routes controllers, which are responsible for obtaining the needed HTTP request data
 * from the router context, and delegate the operational logic to Managers.
 * In order to interact with the router, the `execute` method must be used.
 */
export abstract class RouteController {
  private routeCommandHandler: RouteCommandHandler;

  constructor(routeContextReplierFactory: RouteContextReplierFactory) {
    this.routeCommandHandler = createRouteCommandHandler(routeContextReplierFactory);
  }

  /**
   * The given command is executed, its result and its HTTP status code are returned to the
   * router context via a middleware function.
   * @param routeCommand the command to execute.
   */
  protected execute<T>(routeCommand: RouteCommand<T>) {
    return this.routeCommandHandler(routeCommand);
  }
}
