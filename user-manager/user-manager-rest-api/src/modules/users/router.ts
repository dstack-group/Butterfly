import * as HttpStatus from 'http-status-codes';
import { Router } from '../../utils/Router';
import { UserManager } from './manager';
import { UserRepository } from './repository';
import { CreateUser, UserModel } from './model';
import { User } from './entity';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
import * as validator from './validator';

export const getUserRouter = (routesParams: RoutesInjectionParams) => {
  const UserRouter = new Router('/users');
  const userRepository = new UserRepository(routesParams.database);
  const userManager = new UserManager(userRepository);

  UserRouter
    .get('/',
      async ctx => {
        const { offset, limit } = ctx.query;
        const userList = await userManager.list(offset, limit);
        ctx.body = {
          data: userList,
        };
        ctx.status = HttpStatus.OK;
      })
    .post('/',
      middlewares.bodyParser(),
      middlewares.validateRequest({
        body: validator.createUser,
      }),
      async ctx => {
        const userModel: CreateUser = ctx.request.body;
        const newUser = await userManager.create(userModel);
        ctx.body = {
          data: newUser,
        };
        ctx.status = HttpStatus.CREATED;
      })
    .get('/:email',
      async ctx => {
        const { email } = ctx.params;
        const user = await userManager.findByEmail(email);
        ctx.body = {
          data: new UserModel(user),
        };
        ctx.status = HttpStatus.OK;
      })
    .put('/:email',
      middlewares.bodyParser(),
      async ctx => {
        const userModel: User = ctx.request.body;
        const updatedUser = await userManager.update(userModel);
        ctx.body = {
          data: updatedUser,
        };
        ctx.status = HttpStatus.OK;
      })
    .delete('/:email', async ctx => {
      const { email } = ctx.params;
      await userManager.delete(email);
      ctx.body = {};
      ctx.status = HttpStatus.NO_CONTENT;
    });

  return UserRouter;
};
