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
import {
  CreateSubscriptionBody,
  Subscription,
  SubscriptionParams,
  UpdateSubscription,
  UpdateSubscriptionBody,
  UserEmail,
} from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';
import {
  validateUpdateSubscriptionBody,
  validateCreateSubscriptionBody,
  validateSubscriptionParams,
  validateUserEmailParam,
} from './validator';

export class SubscriptionController extends RouteController {
  private manager: SubscriptionManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: SubscriptionManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private getSubscriptionCommand: RouteCommand<Subscription> = async routeContext => {
    const subscriptionParams = routeContext.getValidatedNamedParams<SubscriptionParams>(validateSubscriptionParams);
    const subscription = await this.manager.findOne<SubscriptionParams, Subscription>(subscriptionParams);

    return {
      data: subscription,
      status: HttpStatus.OK,
    };
  }

  private getSubscriptionsByUserEmailCommand: RouteCommand<Subscription[]> = async routeContext => {
    const subscriptionParams = routeContext.getValidatedNamedParams<UserEmail>(validateUserEmailParam);
    const subscriptionList = await this.manager.find<UserEmail, Subscription>(subscriptionParams);

    return {
      data: subscriptionList,
      status: HttpStatus.OK,
    };
  }

  private createSubscriptionCommand: RouteCommand<Subscription> = async routeContext => {
    const userModel = routeContext.getValidatedRequestBody<CreateSubscriptionBody>(validateCreateSubscriptionBody);
    const newSubscription = await this.manager.create<CreateSubscriptionBody, Subscription>(userModel);

    return {
      data: newSubscription,
      status: HttpStatus.CREATED,
    };
  }

  private updateSubscriptionCommand: RouteCommand<Subscription> = async routeContext => {
    const subscriptionParams =
      routeContext.getValidatedNamedParams<SubscriptionParams>(validateSubscriptionParams);
    const subscriptionBody =
      routeContext.getValidatedRequestBody<UpdateSubscriptionBody>(validateUpdateSubscriptionBody);

    /**
     * Here we need to manually set undefined values by default because if those fields
     * aren't set, pg-promise is going to complain with a `Property ${property} doesn't exist` error.
     */
    const subscriptionModel: UpdateSubscription = {
      ...subscriptionParams,
      contactServices: undefined,
      keywords: undefined,
      userPriority: undefined,
      ...subscriptionBody,
    };

    const subscriptionUpdated = await this.manager.update<UpdateSubscription, Subscription>(subscriptionModel);

    return {
      data: subscriptionUpdated,
      status: HttpStatus.OK,
    };
  }

  private deleteSubscriptionCommand: RouteCommand<Subscription> = async routeContext => {
    const subscriptionParams = routeContext.getValidatedNamedParams<SubscriptionParams>(validateSubscriptionParams);
    await this.manager.delete<SubscriptionParams>(subscriptionParams);

    return {
      data: null,
      status: HttpStatus.OK,
    };
  }

  getSubscription(): Middleware {
    return this.execute(this.getSubscriptionCommand);
  }

  getSubscriptionsByUserEmail(): Middleware {
    return this.execute(this.getSubscriptionsByUserEmailCommand);
  }

  createSubscription(): Middleware {
    return this.execute(this.createSubscriptionCommand);
  }

  updateSubscription(): Middleware {
    return this.execute(this.updateSubscriptionCommand);
  }

  deleteSubscription(): Middleware {
    return this.execute(this.deleteSubscriptionCommand);
  }
}
