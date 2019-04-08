import * as HttpStatus from 'http-status-codes';
import { UserManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { User } from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';

export class UserController extends RouteController {
  private manager: UserManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: UserManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private getUsersCommand: RouteCommand<User[]> = async routeContext => {
    /**
     * TODO: pagination
     */
    const userList = await this.manager.find();
    return {
      data: userList,
    };
  }

  private createUserCommand: RouteCommand<User> = async routeContext => {
    const userModel = routeContext.getRequestBody() as User;
    const newUser = await this.manager.create(userModel);

    return {
      data: newUser,
      status: HttpStatus.CREATED,
    };
  }

  private getUserByEmailCommand: RouteCommand<User> = async routeContext => {
    const { email } = routeContext.getNamedParams() as { email: string };
    const userParams = { email };
    const userFound = await this.manager.findByEmail(userParams as User);

    return {
      data: userFound,
    };
  }

  private deleteUserByEmailCommand: RouteCommand<User> = async routeContext => {
    const { email } = routeContext.getNamedParams() as { email: string };
    const userParams = { email };
    await this.manager.delete(userParams as User);

    return {
      data: null,
      status: HttpStatus.OK,
    };
  }

  getUsers(): Middleware {
    return this.execute(this.getUsersCommand);
  }

  createUser(): Middleware {
    return this.execute(this.createUserCommand);
  }

  getUserByEmail(): Middleware {
    return this.execute(this.getUserByEmailCommand);
  }

  deleteUserByEmail(): Middleware {
    return this.execute(this.deleteUserByEmailCommand);
  }
}
