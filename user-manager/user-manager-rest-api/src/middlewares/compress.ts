import koaCompress from 'koa-compress';
import { Middleware } from '../router/Router';

export function compress(): Middleware {
  return koaCompress();
}
