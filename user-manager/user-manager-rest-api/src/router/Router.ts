import { Middleware, ParameterizedContext } from 'koa';
import KoaRouter, { IRouterParamContext } from 'koa-router';

export type Context<StateT = any, CustomT = {}> = ParameterizedContext<StateT, CustomT>;
export type MiddlewareLambda<T> = (context: T, next?: () => Promise<any>) => any;
// export type Middleware<StateT = any, CustomT = {}> = MiddlewareLambda<Context<StateT, CustomT>>;
export type Middleware = Middleware;

export type RouteMiddleware<StateT, CustomT> =
  Middleware<StateT, CustomT & IRouterParamContext<StateT, CustomT>>;

/**
 * HTTP router contract
 */
export interface RouterMiddleware<StateT = any, CustomT = {}> {
  get: (path: string, ...middleware: Middleware[]) => RouterMiddleware<StateT, CustomT>;
  post: (path: string, ...middleware: Middleware[]) => RouterMiddleware<StateT, CustomT>;
  put: (path: string, ...middleware: Middleware[]) => RouterMiddleware<StateT, CustomT>;
  patch: (path: string, ...middleware: Middleware[]) => RouterMiddleware<StateT, CustomT>;
  delete: (path: string, ...middleware: Middleware[]) => RouterMiddleware<StateT, CustomT>;

  /**
   * It should return a middleware with the list of routes definitions.
   */
  routes: () => RouteMiddleware<StateT, CustomT>;

  /**
   * It should return a middleware with the list of allowed HTTP methods,
   * which could be used by the server app for restricting access disabling the HTTP verbs
   * which aren't used.
   */
  allowedMethods: () => RouteMiddleware<StateT, CustomT>;
}

/**
 * HTTP actions supported by the `Router` RouterMiddleware interface.
 */
export enum HTTPVerb {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  delete = 'delete',
}

/**
 * KoaRouter Adapter class
 */
export class Router<StateT = any, CustomT = {}> implements RouterMiddleware<StateT, CustomT> {
  private router: KoaRouter;

  constructor(prefix?: string) {
    this.router = new KoaRouter<StateT, CustomT>({ prefix });
  }

  get(path: string, ...middleware: Middleware[]) {
    return this.on(HTTPVerb.get, path, ...middleware);
  }

  post(path: string, ...middleware: Middleware[]) {
    return this.on(HTTPVerb.post, path, ...middleware);
  }

  put(path: string, ...middleware: Middleware[]) {
    return this.on(HTTPVerb.put, path, ...middleware);
  }

  patch(path: string, ...middleware: Middleware[]) {
    return this.on(HTTPVerb.patch, path, ...middleware);
  }

  delete(path: string, ...middleware: Middleware[]) {
    return this.on(HTTPVerb.delete, path, ...middleware);
  }

  routes(): RouteMiddleware<StateT, CustomT> {
    return this.router.routes();
  }

  allowedMethods(): RouteMiddleware<StateT, CustomT> {
    return this.router.allowedMethods();
  }

  private on(verb: HTTPVerb, path: string, ...middleware: Middleware[]) {
    this.router[verb](path, ...middleware);
    return this;
  }
}
