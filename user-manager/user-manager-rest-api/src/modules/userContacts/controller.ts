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
import { UserContactManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import {
  UserContact,
  CreateUserContact,
  CreateUserContactURLParams,
  UserContactInfoData,
  UserEmail,
  ContactServiceUserEmailURLParams,
  UpdateUserContact,
  ContactRef,
  UserContactInfo,
} from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';

export class UserContactController extends RouteController {
  private manager: UserContactManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: UserContactManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private getUserContactByUserEmailCommand: RouteCommand<UserContactInfo> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as UserEmail;
    const userContact = await this.manager.findOne<UserEmail, UserContactInfoData>(userContactURLParams);

    return {
      data: userContact.data,
      status: HttpStatus.OK,
    };
  }

  private createUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as CreateUserContactURLParams;
    const { contactRef, userEmail } = routeContext.getRequestBody() as CreateUserContact;
    const userContactModel: CreateUserContact = {
      ...userContactURLParams,
      contactRef,
      userEmail,
    };
    const newUserContact = await this.manager.create<CreateUserContact, UserContact>(userContactModel);

    return {
      data: newUserContact,
      status: HttpStatus.CREATED,
    };
  }

  private updateUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as ContactServiceUserEmailURLParams;
    const { contactRef } = routeContext.getRequestBody() as ContactRef;
    const userContactModel: UpdateUserContact = {
      ...userContactURLParams,
      contactRef,
    };
    const newUserContact = await this.manager.update<UpdateUserContact, UserContact>(userContactModel);

    return {
      data: newUserContact,
      status: HttpStatus.OK,
    };
  }

  private deleteUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as CreateUserContactURLParams;
    await this.manager.delete<CreateUserContactURLParams>(userContactURLParams);

    return {
      data: null,
      status: HttpStatus.OK,
    };
  }

  getUserContactByUserEmail(): Middleware {
    return this.execute(this.getUserContactByUserEmailCommand);
  }

  createUserContact(): Middleware {
    return this.execute(this.createUserContactCommand);
  }

  updateUserContact(): Middleware {
    return this.execute(this.updateUserContactCommand);
  }

  deleteUserContact(): Middleware {
    return this.execute(this.deleteUserContactCommand);
  }
}
