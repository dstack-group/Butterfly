import { Middleware } from '../router/Router';

export function headers(): Middleware {
  return async (ctx, next) => {
    ctx.set('Content-Language', 'en-US');
    await next();
  };
}
