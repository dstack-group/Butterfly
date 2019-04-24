import { Router } from '../../router/Router';
import { UserContactManager } from './manager';
import { UserContactRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
// import * as validator from './validator';
import { UserContactController } from './controller';

export const getUserContactRouter = (routesParams: RoutesInjectionParams) => {
  const userContactRouter = new Router('/user-contacts');
  const userContactRepository = new UserContactRepository(routesParams.database);
  const userContactManager = new UserContactManager(userContactRepository);
  const userContactController = new UserContactController(routesParams.routeContextReplierFactory, userContactManager);

  userContactRouter
    .get('/:userEmail', userContactController.getUserContactByUserEmail())
    .post('/:contactService',
      middlewares.bodyParser(),
      userContactController.createUserContact())
    .put('/:userEmail/:contactService',
      middlewares.bodyParser(),
      userContactController.updateUserContact())
    .delete('/:userEmail/:contactService', userContactController.deleteUserContact());

  return userContactRouter;
};
