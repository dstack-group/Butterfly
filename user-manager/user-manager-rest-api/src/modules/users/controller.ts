/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  controller.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import * as HttpStatus from 'http-status-codes';
import { UserManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { User, CreateUser, UpdateUser, UpdateUserBody, UserEmail } from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';
import {
  validateUpdateUserBody,
  validateCreateUserBody,
  validateEmailParam,
} from './validator';

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
    const userList = await this.manager.find<undefined, User>();
    return {
      data: userList,
    };
  }

  private createUserCommand: RouteCommand<User> = async routeContext => {
    const userModel = routeContext.getValidatedRequestBody<CreateUser>(validateCreateUserBody);
    const newUser = await this.manager.create<CreateUser, User>(userModel);

    return {
      data: newUser,
      status: HttpStatus.CREATED,
    };
  }

  private getUserByEmailCommand: RouteCommand<User> = async routeContext => {
    const { email } = routeContext.getValidatedNamedParams<UserEmail>(validateEmailParam);
    const userParams: UserEmail = { email };
    const userFound = await this.manager.findOne<UserEmail, User>(userParams);

    return {
      data: userFound,
      status: HttpStatus.OK,
    };
  }

  private updateUserByEmailCommand: RouteCommand<User> = async routeContext => {
    const { email } = routeContext.getValidatedNamedParams<UserEmail>(validateEmailParam);
    const userModel = routeContext.getValidatedRequestBody<UpdateUserBody>(validateUpdateUserBody);

    /**
     * Here we need to manually set undefined values by default because if those fields
     * aren't set, pg-promise is going to complain with a `Property ${property} doesn't exist` error.
     */
    const userParams: UpdateUser = {
      email,
      enabled: undefined,
      firstname: undefined,
      lastname: undefined,
      ...userModel,
    };

    const userUpdated = await this.manager.update<UpdateUser, User>(userParams);

    return {
      data: userUpdated,
      status: HttpStatus.OK,
    };
  }

  private deleteUserByEmailCommand: RouteCommand<User> = async routeContext => {
    const { email } = routeContext.getValidatedNamedParams<UserEmail>(validateEmailParam);
    const userParams = { email };
    await this.manager.delete<UserEmail>(userParams);

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

  updateUserByEmail(): Middleware {
    return this.execute(this.updateUserByEmailCommand);
  }

  deleteUserByEmail(): Middleware {
    return this.execute(this.deleteUserByEmailCommand);
  }
}
