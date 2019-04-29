/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  router.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Router } from '../../router/Router';
import { SubscriptionManager } from './manager';
import { SubscriptionRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
// import * as validator from './validator';
import { SubscriptionController } from './controller';

export const getSubscriptionRouter = (routesParams: RoutesInjectionParams) => {
  const subscriptionRouter = new Router('/subscriptions');
  const subscriptionRepository = new SubscriptionRepository(routesParams.database);
  const subscriptionManager = new SubscriptionManager(subscriptionRepository);
  const subscriptionController =
    new SubscriptionController(routesParams.routeContextReplierFactory, subscriptionManager);

  subscriptionRouter
    .post('/',
      middlewares.bodyParser(),
      subscriptionController.createSubscription());

  return subscriptionRouter;
};
