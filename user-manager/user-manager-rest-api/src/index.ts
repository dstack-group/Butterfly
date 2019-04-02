import { Server } from './server/Server';
import { getAppConfig } from './config/index';
import * as middlewares from './middlewares/index';
import { routersFactory, routeContextReplierFactory } from './routes/index';
import { ServerConfig } from './server/ServerConfig';
import { Log } from './config/logger';
import { registerProcessEvents } from './utils/registerProcessEvents';
import { getDatabaseConfig } from './config/database';
import { PgDatabaseConnection } from './database/PgDatabaseConnection';
import { EnvironmentConfigManager } from './config/EnvironmentConfigManager';
import { ConfigManager } from './config/ConfigManager';
import { DatabaseConfig } from './database';

const configManager: ConfigManager = new EnvironmentConfigManager();
const config = getAppConfig(configManager);
const logger = new Log(config.name);

const middlewareList = [
  middlewares.compress(),
  middlewares.logRouteRequest(logger),
  middlewares.errorHandler(logger),
];

const databaseConfig: DatabaseConfig = getDatabaseConfig(configManager);
const serverConfig: ServerConfig = {
  databaseConfig,
  logger,
  middlewares: middlewareList,
  port: config.port,
  routeContextReplierFactory,
  routersFactory,
};

const databaseConnection = new PgDatabaseConnection(databaseConfig);
export const app = new Server(serverConfig, databaseConnection);
export const server = app.createServer();

registerProcessEvents(logger, app);

server.on('close', () => {
  logger.info('Server closed');
});

server.on('error', () => {
  logger.error('Server error');
});
