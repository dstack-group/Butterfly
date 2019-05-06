/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  RoutesInjectionParams.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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
