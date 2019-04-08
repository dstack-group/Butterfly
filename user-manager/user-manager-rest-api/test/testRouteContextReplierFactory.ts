import { RouteContextReplier } from '../src/router/RouteContextReplier';

export const routeContextReplierFactory = (context: unknown): RouteContextReplier => {
  return new KoaRouteContext(context);
};
