import combineRouters from 'koa-combine-routers';
import Router from 'koa-router';

/**
 * Compose multiple instances of koa-router
 * into a single `use`-able middleware.
 */
export const composeRoutes = (routers: Array<Router<any, {}>>) => combineRouters(routers);
