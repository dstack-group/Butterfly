// @ts-ignore
import { getHealthRouter } from './health';
import { getWebhookRouter } from './webhook';
import { Logger } from '../config/logger';

export const routersFactory = (logger: Logger) => {
  const routers = [
    getHealthRouter(),
    getWebhookRouter(logger),
  ];

  return routers;
};
