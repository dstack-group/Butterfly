import { Database } from '../database/Database';
import { Logger } from '../config/logger';

/**
 * Contract of the objects that must be provided to the REST routers.
 */
export interface RoutesInjectionParams {
  database: Database;
  logger: Logger;
}
