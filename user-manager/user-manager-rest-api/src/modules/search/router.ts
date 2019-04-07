import * as HttpStatus from 'http-status-codes';
import { Router } from '../../router/Router';
import { SearchManager } from './manager';
import { SearchRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
import { Event } from '../../common/Event';

export const getSearchRouter = (routesParams: RoutesInjectionParams) => {
  const SearchRouter = new Router('/search');
  const searchRepository = new SearchRepository(routesParams.database);
  const searchManager = new SearchManager(searchRepository);

  SearchRouter
    .post('/events/users',
      middlewares.bodyParser(),
      /*
      middlewares.validateRequest({
        body: validator.getUsersRecipientsFromAlert,
      }),
      */
      async ctx => {
        const searchModel: Event = ctx.request.body;
        routesParams.logger.info('SEARCH MODEL: ', searchModel);
        const eventWithRecipients = await searchManager.searchUsersFromEvent(searchModel);
        ctx.body = {
          data: eventWithRecipients,
        };
        ctx.status = HttpStatus.OK;
      });

  return SearchRouter;
};
