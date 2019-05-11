import { UserContacts, UserContact, CreateUserContact} from './entities/UserContactsEntities';
import { UpdateUserContact, RemoveUserContact, FindUserContacts } from './entities/UserContactsEntities';
import { RestRequestsManager, HttpMethod } from './RestRequestsManager';
import { ServerConfig } from '../database/ServerConfig';

export class UserContactsRestRequests {

  private manager: RestRequestsManager;
  private path: string;

  constructor(serverConfig: ServerConfig) {
    this.manager = new RestRequestsManager(serverConfig);
    this.path = 'user-contacts';
  }

  create(contact: CreateUserContact): Promise<UserContact> {
    const { service, ...payload } = contact;
    return this.manager.submitRequest<UserContact>(
      `${this.path}/${contact.service}`,
      HttpMethod.POST,
      payload);
  }

  update(contact: UpdateUserContact): Promise<UserContact> {
    const { service, userEmail, ...payload } = contact;
    const endpoint = `${this.path}/${contact.userEmail}/${contact.service}`;
    return this.manager.submitRequest<UserContact>(endpoint, HttpMethod.PUT, payload);
  }

  find(contact: FindUserContacts): Promise<UserContacts> {
    return this.manager.submitRequest<UserContacts>(`${this.path}/${contact.userEmail}`, HttpMethod.GET);
  }

  remove(contact: RemoveUserContact): Promise<void> {
    const endpoint = `${this.path}/${contact.userEmail}/${contact.service}`;
    return this.manager.submitRequest<void>(endpoint, HttpMethod.DELETE);
  }
}
