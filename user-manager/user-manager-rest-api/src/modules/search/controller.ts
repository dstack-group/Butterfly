import * as HttpStatus from 'http-status-codes';
import { SearchManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { EventReceiversResult, EventReceiver } from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';
import { Event } from '../../common/Event';

export class SearchController extends RouteController {
  private manager: SearchManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: SearchManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private searchEventReceiversCommand: RouteCommand<EventReceiver[]> = async routeContext => {
    const eventModel = routeContext.getRequestBody() as Event;
    const { saveEvent } = routeContext.getQueryParams() as { saveEvent: string };
    const shouldSaveEvent = saveEvent === 'true';
    const receivers: EventReceiversResult = await this.manager.searchReceiversByRecord(eventModel, shouldSaveEvent);

    return {
      data: receivers.userContactList,
      status: shouldSaveEvent ? HttpStatus.CREATED : HttpStatus.OK,
    };
  }

  searchEventReceivers(): Middleware {
    return this.execute(this.searchEventReceiversCommand);
  }
}
