import { RouteContext } from './RouteContext';
import { RouteResponse } from './RouteResponse';

/**
 * A RouteCommand, given a framework-independent HTTP request context object, performs an asynchronous
 * computation and returns its result, also specifying the proper HTTP status code to be returned.
 */
export type RouteCommand<T> = (routeContext: RouteContext) => Promise<RouteResponse<T>>;
