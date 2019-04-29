/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ServerConfig.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Middleware } from 'koa';
import { Router } from '../router/Router';
import { Logger } from '../logger';
import { DatabaseConfig } from '../database';
import { RoutesInjectionParams } from '../routes/RoutesInjectionParams';
import { RouteContextReplierFactory } from '../router/RouteContextReplierFactory';
import { MetricsProvider } from '../common/metrics/MetricsProvider';

export interface ServerConfig {
  databaseConfig: DatabaseConfig;
  logger: Logger;
  metricsProvider: MetricsProvider;
  middlewares: Middleware[];
  port: number;
  routeContextReplierFactory: RouteContextReplierFactory;
  routersFactory: (injectionParams: RoutesInjectionParams) => Router[];
}
