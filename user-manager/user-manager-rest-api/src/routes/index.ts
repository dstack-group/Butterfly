import { RoutesInjectionParams } from './RoutesInjectionParams';
import { getHealthRouter } from '../modules/health';
import { getUserRouter } from '../modules/users/router';
import { getSearchRouter } from '../modules/search/router';

export const routersFactory = (routesParams: RoutesInjectionParams) => {
  const routers = [
    getHealthRouter(),
    getUserRouter(routesParams),
    getSearchRouter(routesParams),
  ];

  return routers;
};
