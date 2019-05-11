import { User, CreateUser, UpdateUser, FindUser, RemoveUser } from './entities/UserEntities';
import { RestRequestsManager, HttpMethod } from './RestRequestsManager';
import { ServerConfig } from '../database/ServerConfig';

export class UserRestRequests {

  private manager: RestRequestsManager;
  private path: string;

  constructor(serverConfig: ServerConfig) {
    this.manager = new RestRequestsManager(serverConfig);
    this.path = 'users';
  }

  create(user: CreateUser): Promise<User> {
    return this.manager.submitRequest<User>(this.path, HttpMethod.POST, user);
  }

  update(user: UpdateUser): Promise<User> {
    const {email, ...payload} = user;
    return this.manager.submitRequest<User>(`${this.path}/${user.email}`, HttpMethod.PATCH, payload);
  }

  find(user: FindUser): Promise<User> {
    return this.manager.submitRequest<User>(`${this.path}/${user.email}`, HttpMethod.GET);
  }

  findAll(): Promise<User[]> {
    return this.manager.submitRequest<User[]>(this.path, HttpMethod.GET);
  }

  remove(user: RemoveUser): Promise<User> {
    return this.manager.submitRequest<User>(`${this.path}/${user.email}`, HttpMethod.DELETE);
  }
}
