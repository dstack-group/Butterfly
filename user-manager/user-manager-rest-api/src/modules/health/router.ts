import { Router } from '../../utils/Router';
import HealthManager from './HealthManager';
import * as HttpStatus from 'http-status-codes';

export const getHealthRouter = () => {
  const HealthRouter = new Router('/health');
  const healthManager = new HealthManager();

  HealthRouter
    .get('/', async ctx => {
      ctx.body = {};
      ctx.status = HttpStatus.NO_CONTENT;
    });

  HealthRouter
    .get('/metrics', async ctx => {
      const data = healthManager.metrics();
      ctx.body = {
        data,
      };
      ctx.status = HttpStatus.OK;
    });

  return HealthRouter;
};
