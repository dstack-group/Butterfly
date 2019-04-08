import { Server } from './server/Server';
import * as middlewares from './middlewares/index';
import { routersFactory, routeContextReplierFactory } from './routes/index';
import { ServerConfig } from './server/ServerConfig';
import { Logger } from './logger';
import { getDatabaseConfig, DatabaseConfig, DatabaseConnection } from './database';
import { getAppConfig, AbstractConfigManager } from './config';
import { MetricsProvider } from './common/metrics/MetricsProvider';

export interface SetupParams {
  configManager: AbstractConfigManager;
  databaseConnection: DatabaseConnection;
  logger: Logger;
  metricsProvider: MetricsProvider;
}

export function setup(params: SetupParams) {
  const {
    configManager,
    databaseConnection,
    logger,
    metricsProvider,
  } = params;

  const config = getAppConfig(configManager);

  const middlewareList = [
    middlewares.compress(),
    middlewares.logRouteRequest(logger),
    middlewares.errorHandler({
      isProduction: config.isProduction,
      logger,
      routeContextReplierFactory,
    }),
  ];

  const databaseConfig: DatabaseConfig = getDatabaseConfig(configManager);
  const serverConfig: ServerConfig = {
    databaseConfig,
    logger,
    metricsProvider,
    middlewares: middlewareList,
    port: config.port,
    routeContextReplierFactory,
    routersFactory,
  };

  const app = new Server(serverConfig, databaseConnection);
  const server = app.createServer();

  return {
    app,
    server,
  };
}
