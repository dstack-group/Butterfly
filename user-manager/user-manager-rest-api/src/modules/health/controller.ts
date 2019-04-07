import * as HttpStatus from 'http-status-codes';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { RouteCommand } from '../../router/RouteCommand';
import { HealthMetrics } from './entity';
import { HealthManager } from './manager';
import { Middleware } from 'koa';

export class HealthController extends RouteController {
  private manager: HealthManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: HealthManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private getIsAliveCommand: RouteCommand<null> = async routeContext => {
    return {
      data: null,
      status: HttpStatus.NO_CONTENT,
    };
  }

  private getMetricsCommand: RouteCommand<HealthMetrics> = async routeContext => {
    const metrics = await this.manager.getMetrics();

    return {
      data: metrics,
      status: HttpStatus.OK,
    };
  }

  getIsAlive(): Middleware {
    return this.execute(this.getIsAliveCommand);
  }

  getMetrics(): Middleware {
    return this.execute(this.getMetricsCommand);
  }
}
