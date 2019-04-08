import koaBodyParser from 'koa-bodyparser';
import { Middleware } from '../router/Router';

/**
 * Middleware that adds the possibility to parse the body of
 * PUT, POST, PATCH HTTP requests.
 */
export function bodyParser(): Middleware {
  return koaBodyParser({
    enableTypes: ['json'],
    strict: true,
  });
}
