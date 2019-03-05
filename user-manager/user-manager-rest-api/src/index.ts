import { Server } from './server/Server';
import { config } from './config/index';
import * as middlewares from './middlewares/index';
import { routersFactory } from './routes/index';
import { ServerConfig } from './server/ServerConfig';
import { Log } from './config/logger';
import { registerProcessEvents } from './utils/registerProcessEvents';
import { databaseConfig } from './config/database';

const logger = new Log();

const middlewareList = [
  middlewares.compress(),
  middlewares.logRouteRequest(logger),
  middlewares.errorHandler(logger),
];

const serverConfig: ServerConfig = {
  databaseConfig,
  logger,
  middlewares: middlewareList,
  port: config.port,
  routersFactory,
};

export const app = new Server(serverConfig);
export const server = app.createServer();

registerProcessEvents(logger, app);

server.on('close', () => {
  logger.info('Server closed');
});

server.on('error', () => {
  logger.error('Server error');
});
