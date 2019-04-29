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
import { UserManager } from './manager';
import { UserRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
// import * as validator from './validator';
import { UserController } from './controller';

export const getUserRouter = (routesParams: RoutesInjectionParams) => {
  const userRouter = new Router('/users');
  const userRepository = new UserRepository(routesParams.database);
  const userManager = new UserManager(userRepository);
  const userController = new UserController(routesParams.routeContextReplierFactory, userManager);

  userRouter
    .get('/', userController.getUsers())
    /*
    .get('/',
      async ctx => {
        const { offset, limit } = ctx.query;
        const userList = await userManager.list(offset, limit);
        ctx.body = {
          data: userList,
        };
        ctx.status = HttpStatus.OK;
      })
    */
    .post('/',
      middlewares.bodyParser(),
      /*
      middlewares.validateRequest({
        body: validator.createUser,
      }),
      */
      userController.createUser())
    .get('/:email', userController.getUserByEmail())
    .patch('/:email',
      middlewares.bodyParser(),
      userController.updateUserByEmail())
    .delete('/:email', userController.deleteUserByEmail());

  return userRouter;
};
