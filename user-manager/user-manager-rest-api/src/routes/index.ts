import { RoutesInjectionParams } from './RoutesInjectionParams';
import { getHealthRouter } from '../modules/health';
import { getUserRouter } from '../modules/users/router';
import { getSearchRouter } from '../modules/search/router';
import { getProjectRouter } from '../modules/projects/router';
import { KoaRouteContext } from '../router/KoaRouteContext';
import { Context } from '../router/Router';
import { RouteContextReplier } from '../router/RouteContextReplier';

export const routersFactory = (routesParams: RoutesInjectionParams) => {
  const routers = [
    getHealthRouter(routesParams),
    getUserRouter(routesParams),
    getProjectRouter(routesParams),
    getSearchRouter(routesParams),
  ];

  return routers;
};

export const routeContextReplierFactory = (context: Context): RouteContextReplier => {
  return new KoaRouteContext(context);
};
