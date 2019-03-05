// @ts-ignore
import * as HttpStatus from 'http-status-codes';
import Router from 'koa-router';
import { Logger } from '../../config/logger';

export const getWebhookRouter = (logger: Logger) => {
  const WebhookRouter = new Router({
    prefix: '/webhook',
  });

  WebhookRouter
    .post('/redmine', async ctx => {
      logger.info('New report from Redmine: ', ctx.request.body);

      ctx.body = ctx.request.body;
      ctx.status = HttpStatus.OK;
    });

  return WebhookRouter;
};
