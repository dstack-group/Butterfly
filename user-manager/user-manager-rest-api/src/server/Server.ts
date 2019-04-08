import Koa from 'koa';
import { Server as HTTPServer } from 'http';
import { ServerConfig } from './';
// import { asyncRetry } from '../utils/asyncRetry';
import { Logger } from '../logger';
import { Database, DatabaseConnection } from '../database';
import { RoutesInjectionParams } from '../routes/RoutesInjectionParams';
import { MetricsProvider } from '../common/metrics/MetricsProvider';
import { RouteContextReplierFactory } from '../router/RouteContextReplierFactory';

export class Server {
  private app: Koa = new Koa();

  private config: ServerConfig;
  private database: Database;
  private server?: HTTPServer;
  private logger: Logger;
  private metricsProvider: MetricsProvider;
  private routeContextReplierFactory: RouteContextReplierFactory;

  constructor(config: ServerConfig, databaseConnection: DatabaseConnection) {
    this.config = config;
    this.logger = config.logger;
    this.database = new Database(databaseConnection);
    this.routeContextReplierFactory = config.routeContextReplierFactory;
    this.metricsProvider = config.metricsProvider;
  }

  createServer() {
    this.logger.info('Starting server');
    this.setupMiddlewares();
    this.setupRoutes();

    this.server = this.app.listen(this.config.port);
    return this.server;
  }

  async closeServer(): Promise<void> {
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

    await this.stopServerProcesses();
  }

  private stopServerProcesses() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) {
        this.logger.info('No server to stop');
        resolve();
      } else {
        this.server.close(() => {
          this.database.close()
            .then(() => {
              this.logger.info('Closed database connection');
            })
            .then(resolve)
            .catch(reject);
        });
      }
    });
  }

  /*
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
  */

  private setupMiddlewares() {
    this.config.middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  private setupRoutes() {
    const injectionParams: RoutesInjectionParams = {
      database: this.database,
      logger: this.logger,
      metricsProvider: this.metricsProvider,
      routeContextReplierFactory: this.routeContextReplierFactory,
    };

    this.config.routersFactory(injectionParams).forEach(router => {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods());
    });
  }
}
