/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  controller.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import * as HttpStatus from 'http-status-codes';
import { SubscriptionManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { CreateSubscription, Subscription } from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';

export class SubscriptionController extends RouteController {
  private manager: SubscriptionManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: SubscriptionManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private createSubscriptionCommand: RouteCommand<Subscription> = async routeContext => {
    const subscriptionModel = routeContext.getRequestBody() as CreateSubscription;
    const newSubscription: Subscription = await this.manager.createSubscription(subscriptionModel);

    return {
      data: newSubscription,
      status: HttpStatus.CREATED,
    };
  }

  createSubscription(): Middleware {
    return this.execute(this.createSubscriptionCommand);
  }
}
