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
