import { User, CreateUser, UpdateUser, FindUser, RemoveUser } from './entities/UserEntities';
import { RestRequests, HttpMethod } from './RestRequests';
import { ServerConfig } from '../database/ServerConfig';

export class UserRestRequests extends RestRequests {

  private path: string;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.path = 'users';
  }

  create(user: CreateUser): Promise<User> {
    return this.submitRequest<User>(this.path, HttpMethod.POST, user);
  }

  update(user: UpdateUser): Promise<User> {
    return this.submitRequest<User>(`${this.path}/${user.email}`, HttpMethod.PATCH, user);
  }

  find(user: FindUser): Promise<User> {
    return this.submitRequest<User>(`${this.path}/${user.email}`, HttpMethod.GET);
  }

  findAll(): Promise<User[]> {
    return this.submitRequest<User[]>(this.path, HttpMethod.GET);
  }

  remove(user: RemoveUser): Promise<void> {
    return this.submitRequest<void>(`${this.path}/${user.email}`, HttpMethod.DELETE);
  }
}
