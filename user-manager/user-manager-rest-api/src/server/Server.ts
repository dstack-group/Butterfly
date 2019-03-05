import Koa from 'koa';
import { Server as HTTPServer } from 'http';
import { ServerConfig } from './';
import { asyncRetry } from '../utils/asyncRetry';
import { Logger } from '../config/logger';
import { Database } from '../database';
import { RoutesInjectionParams } from '../routes/RoutesInjectionParams';

export class Server {
  private app: Koa = new Koa();

  private config: ServerConfig;
  private database: Database;
  private server?: HTTPServer;
  private logger: Logger;

  constructor(config: ServerConfig) {
    this.config = config;
    this.logger = config.logger;
    this.database = new Database(config.databaseConfig);
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
    /*
    try {
      await asyncRetry({
        input: this.checkPendingRequests,
        maxTimeout: 5000,
        retries: 10,
      });
    } finally {
      return this.stopServerProcesses();
    }
    */

    return this.stopServerProcesses();
  }

  private stopServerProcesses() {
    return new Promise<void>((resolve, reject) => {
      this.server!.close(async () => {
        try {
          await this.database.close();
          resolve();
        } catch (err) {
          reject(err);
        }
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
    const injectionParams: RoutesInjectionParams = {
      database: this.database,
      logger: this.logger,
    };

    this.config.routersFactory(injectionParams).forEach(router => {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods());
    });
  }
}
