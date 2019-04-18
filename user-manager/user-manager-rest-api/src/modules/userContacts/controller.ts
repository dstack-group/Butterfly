import * as HttpStatus from 'http-status-codes';
import { UserContactManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { UserContact, CreateUserContact, CreateUserContactURLParams } from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';

export class UserContactController extends RouteController {
  private manager: UserContactManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: UserContactManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
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

  private deleteUserContactCommand: RouteCommand<UserContact> = async routeContext => {
    const userContactURLParams = routeContext.getNamedParams() as unknown as CreateUserContactURLParams;
    await this.manager.delete(userContactURLParams);

    return {
      data: null,
      status: HttpStatus.OK,
    };
  }

  createUserContact(): Middleware {
    return this.execute(this.createUserContactCommand);
  }

  deleteUserContact(): Middleware {
    return this.execute(this.deleteUserContactCommand);
  }
}
