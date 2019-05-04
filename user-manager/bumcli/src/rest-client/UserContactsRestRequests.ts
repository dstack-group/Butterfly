import { UserContacts, UserContact, CreateUserContact} from './entities/UserContactsEntities';
import { UpdateUserContact, RemoveUserContact, FindUserContacts } from './entities/UserContactsEntities';
import { RestRequests, HttpMethod } from './RestRequests';
import { ServerConfig } from '../database/ServerConfig';

export class UserContactsRestRequests extends RestRequests {

  private path: string;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.path = 'user-contacts';
  }

  create(contact: CreateUserContact): Promise<UserContact> {
    return this.submitRequest<UserContact>(`${this.path}/${contact.service}`, HttpMethod.POST, contact);
  }

  update(contact: UpdateUserContact): Promise<UserContact> {
    const endpoint: string = `${this.path}/${contact.userEmail}/${contact.service}`;
    return this.submitRequest<UserContact>(endpoint, HttpMethod.PUT, contact);
  }

  find(contact: FindUserContacts): Promise<UserContacts> {
    return this.submitRequest<UserContacts>(`${this.path}/${contact.userEmail}`, HttpMethod.GET);
  }

  remove(contact: RemoveUserContact): Promise<void> {
    const endpoint: string = `${this.path}/${contact.userEmail}/${contact.service}`;
    return this.submitRequest<void>(endpoint, HttpMethod.DELETE);
  }
}
