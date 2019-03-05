// @ts-ignore
import * as HttpStatus from 'http-status-codes';
import Router from 'koa-router';

export const getHealthRouter = () => {
  const HealthRouter = new Router({
    prefix: '/health',
  });

  HealthRouter
    .get('/', async ctx => {
      ctx.body = {
        data: 'OK',
      };
      ctx.status = HttpStatus.OK;
    });

  return HealthRouter;
};
