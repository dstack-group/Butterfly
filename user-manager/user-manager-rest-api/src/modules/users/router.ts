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
    /*
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
    */
    .delete('/:email', userController.deleteUserByEmail());

  return userRouter;
};
