import { Database } from '../database/Database';
import { Logger } from '../logger';
import { RouteContextReplierFactory } from '../router/RouteContextReplierFactory';
import { MetricsProvider } from '../common/metrics/MetricsProvider';

/**
 * Contract of the objects that must be provided to the REST routers.
 */
export interface RoutesInjectionParams {
  database: Database;
  logger: Logger;
  metricsProvider: MetricsProvider;
  routeContextReplierFactory: RouteContextReplierFactory;
}
