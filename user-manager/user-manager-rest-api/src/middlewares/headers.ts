import { Middleware } from '../utils/Router';

export function headers(): Middleware {
  return async (ctx, next) => {
    ctx.set('Content-Type', 'application/json');
    await next();
  };
}
