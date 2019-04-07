import * as HttpStatus from 'http-status-codes';
import { Router, Middleware } from '../../router/Router';
import { HealthRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import { HealthManager } from './manager';
import { HealthController } from './controller';
import { RouteCommand } from '../../router/RouteCommand';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { RouteContextReplier } from '../../router/RouteContextReplier';

export type RouteCommandHandler = <T>(routeCommandCreator: RouteCommand<T>) => Middleware;
export type RouteCommandHandlerCreator = (contextReplierFactory: RouteContextReplierFactory) => RouteCommandHandler;

export const createRouteCommandHandler: RouteCommandHandlerCreator = contextReplierFactory =>
  routeCommandCreator =>
    async context => {
      const contextWrapper: RouteContextReplier = contextReplierFactory(context);
      const { data, status } = await routeCommandCreator(contextWrapper);
      contextWrapper.reply(data, status);
    };

export const getHealthRouter = (routesParams: RoutesInjectionParams) => {
  const healthRouter = new Router('/health');
  const healthRepository = new HealthRepository(routesParams.metricsProvider);
  const healthManager = new HealthManager(healthRepository);
  const healthController = new HealthController(routesParams.routeContextReplierFactory, healthManager);

  healthRouter
    .get('/', healthController.getIsAlive())
    .get('/metrics', healthController.getMetrics());

  return healthRouter;
};
