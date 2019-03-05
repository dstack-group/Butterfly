import { Middleware } from 'koa';
import compose from 'koa-compose';
import Router from 'koa-router';
import { Logger } from './config/logger';

export interface ServerConfig {
  logger: Logger;
  middlewares: Middleware[];
  port: number;
  routersFactory: (logger: Logger) => Router[];
}
