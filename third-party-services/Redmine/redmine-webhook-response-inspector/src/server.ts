import Koa, { Middleware } from 'koa';
import { Server as HTTPServer } from 'http';
import { ServerConfig } from './ServerConfig';
import { asyncRetry } from './utils/asyncRetry';
import { Logger } from './config/logger';

export class Server {
  private config: ServerConfig;
  private app: Koa;
  private server?: HTTPServer;
  private logger: Logger;

  constructor(config: ServerConfig) {
    this.config = config;
    this.logger = config.logger;
    this.app = new Koa();
  }

  createServer() {
    this.logger.info('Starting server');
    this.setupMiddlewares();
    this.setupRoutes();

    this.server = this.app.listen(this.config.port);
    return this.server;
  }

  closeServer(): Promise<void> {
    this.logger.info('Closing server');
    return new Promise<void>((resolve, reject) => {
      asyncRetry({
        input: this.checkPendingRequests,
        maxTimeout: 5000,
        retries: 10,
      })
        .then(() => {
          this.server!.close(() => resolve());
        })
        .catch(err => {
          this.server!.close(() => reject(err));
        });
    });
  }

  private checkPendingRequests(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.server!.getConnections((err, pendingRequests) => {
        if (err) {
          reject(err);
        } else if (pendingRequests > 0) {
          reject(`Number of pending requests: ${pendingRequests}`);
        } else {
          resolve();
        }
      });
    });
  }

  private setupMiddlewares() {
    this.config.middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  private setupRoutes() {
    this.config.routersFactory(this.logger).forEach(router => {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods());
    });
  }
}
