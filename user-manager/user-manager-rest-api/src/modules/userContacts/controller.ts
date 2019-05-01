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
  UserContactInfoData,
  UserEmail,
  ContactServiceUserEmailURLParams,
  UpdateUserContact,
  ContactRef,
  UserContactInfo,
  ContactService,
  CreateUserContactBody,
} from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';
import {
  validateUserEmailParam,
  validateCreateUserContactBody,
  validateContactServiceParam,
  validateContactServiceUserEmailParams,
  validateUpdateUserContactBody,
} from './validator';

export class UserContactController extends RouteController {
  private manager: UserContactManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: UserContactManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private getUserContactByUserEmailCommand: RouteCommand<UserContactInfo> = async routeContext => {
    const userContactURLParams = routeContext.getValidatedNamedParams<UserEmail>(validateUserEmailParam);
    const userContact = await this.manager.findOne<UserEmail, UserContactInfoData>(userContactURLParams);

    return {
      data: userContact.data,
      status: HttpStatus.OK,
    };
  }

  private createUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams = routeContext.getValidatedNamedParams<ContactService>(validateContactServiceParam);
    const { contactRef, userEmail } =
      routeContext.getValidatedRequestBody<CreateUserContactBody>(validateCreateUserContactBody);
    const userContactModel: CreateUserContact = {
      ...userContactURLParams,
      contactRef,
      userEmail,
    };

    try {
      const newUserContact = await this.manager.create<CreateUserContact, UserContact>(userContactModel);

      return {
        data: newUserContact,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error instanceof Error) {
        // TODO: this should be an EntityAssertionViolationError or something of the sort
        // when the error is thrown from a SQL RAISE EXCEPTION.
        // tslint:disable-next-line: no-console
        console.log('ERROR CREATING NEW CONTACT MESSAGE', error.message);
      }

      throw error;
    }
  }

  private updateUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams =
      routeContext.getValidatedNamedParams<ContactServiceUserEmailURLParams>(validateContactServiceUserEmailParams);
    const { contactRef } = routeContext.getValidatedRequestBody<ContactRef>(validateUpdateUserContactBody);
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
    const userContactURLParams =
      routeContext.getValidatedNamedParams<ContactServiceUserEmailURLParams>(validateContactServiceUserEmailParams);
    await this.manager.delete<ContactServiceUserEmailURLParams>(userContactURLParams);

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
