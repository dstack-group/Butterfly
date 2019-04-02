import { Database } from '../database/Database';
import { Logger } from '../config/logger';
import { RouteContextReplierFactory } from '../modules/common/router/RouteContextReplierFactory';

/**
 * Contract of the objects that must be provided to the REST routers.
 */
export interface RoutesInjectionParams {
  database: Database;
  logger: Logger;
  routeContextReplierFactory: RouteContextReplierFactory;
}
