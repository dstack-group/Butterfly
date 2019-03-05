import { Server } from './server';
import { config } from './config/index';
import { middlewares } from './middlewares/index';
import { routersFactory } from './routes/index';
import { ServerConfig } from './ServerConfig';
import { Log } from './config/logger';
import { registerProcessEvents } from './utils/registerProcessEvents';

const logger = new Log();

const serverConfig: ServerConfig = {
  logger,
  middlewares,
  port: config.port,
  routersFactory,
};

const app = new Server(serverConfig);
const server = app.createServer();

registerProcessEvents(logger, app);

server.on('close', () => {
  console.log('Server closed');
});

server.on('error', () => {
  console.log('Server error');
});
