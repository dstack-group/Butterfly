import { Middleware } from 'koa';
import { Router } from '../router/Router';
import { Logger } from '../logger';
import { DatabaseConfig } from '../database';
import { RoutesInjectionParams } from '../routes/RoutesInjectionParams';
import { RouteContextReplierFactory } from '../router/RouteContextReplierFactory';
import { MetricsProvider } from '@src/common/metrics/MetricsProvider';

export interface ServerConfig {
  databaseConfig: DatabaseConfig;
  logger: Logger;
  metricsProvider: MetricsProvider;
  middlewares: Middleware[];
  port: number;
  routeContextReplierFactory: RouteContextReplierFactory;
  routersFactory: (injectionParams: RoutesInjectionParams) => Router[];
}
