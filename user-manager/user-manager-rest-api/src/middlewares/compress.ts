import koaCompress from 'koa-compress';
import { Middleware } from '../utils/Router';

export function compress(): Middleware {
  return koaCompress();
}
