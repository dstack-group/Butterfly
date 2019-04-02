import { RoutesInjectionParams } from './RoutesInjectionParams';
import { getHealthRouter } from '../modules/health';
import { getUserRouter } from '../modules/users/router';
import { getSearchRouter } from '../modules/search/router';
import { KoaRouteContext } from '../utils/KoaRouteContext';
import { Context } from '../utils/Router';
import { RouteContextReplier } from '../modules/common/router/RouteContextReplier';

export const routersFactory = (routesParams: RoutesInjectionParams) => {
  const routers = [
    getHealthRouter(),
    getUserRouter(routesParams),
    getSearchRouter(routesParams),
  ];

  return routers;
};

export const routeContextReplierFactory = (context: Context): RouteContextReplier => {
  return new KoaRouteContext(context);
};
