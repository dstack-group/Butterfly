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
