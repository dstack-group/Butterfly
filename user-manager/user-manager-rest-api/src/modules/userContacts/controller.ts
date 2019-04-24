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
} from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';

export class UserContactController extends RouteController {
  private manager: UserContactManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: UserContactManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  /**
   * TODO: the T type on the manager classes should be provided inline for each method,
   * not at the root level.
   */
  // @ts-ignore
  private getUserContactByUserEmailCommand: RouteCommand<UserContactInfoData> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as UserEmail;
    const userContact = await this.manager.findOne(userContactURLParams) as unknown as UserContactInfoData;

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
    const newUserContact = await this.manager.create(userContactModel);

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
    const newUserContact = await this.manager.update(userContactModel);

    return {
      data: newUserContact,
      status: HttpStatus.OK,
    };
  }

  private deleteUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as CreateUserContactURLParams;
    await this.manager.delete(userContactURLParams);

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
