import { Router } from '../../router/Router';
import { HealthRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import { HealthManager } from './manager';
import { HealthController } from './controller';

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
