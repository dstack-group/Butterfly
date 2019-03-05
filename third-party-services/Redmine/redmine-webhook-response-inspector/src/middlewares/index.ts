import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import koaLogger from 'koa-logger';

export const middlewares = [
  koaLogger(),
  compress(),
  bodyParser(),
];
