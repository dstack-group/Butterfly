/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  router.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Router } from '../../router/Router';
import { SearchManager } from './manager';
import { SearchRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
import { SearchController } from './controller';

export const getSearchRouter = (routesParams: RoutesInjectionParams) => {
  const searchRouter = new Router('/search');
  const searchRepository = new SearchRepository(routesParams.database);
  const searchManager = new SearchManager(searchRepository);
  const searchController = new SearchController(routesParams.routeContextReplierFactory, searchManager);

  searchRouter
    .post('/receivers',
      middlewares.bodyParser(),
      searchController.searchEventReceivers());

  return searchRouter;
};
