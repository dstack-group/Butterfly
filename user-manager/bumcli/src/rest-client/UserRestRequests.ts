import { User, CreateUser, UpdateUser, FindUser, RemoveUser } from './entities/UserEntities';
import { RestRequests, HttpMethod } from './RestRequests';

export class UserRestRequests extends RestRequests {

  create(user: CreateUser): Promise<User> {
    return this.submitRequest<User>('users', HttpMethod.POST, user);
  }

  update(user: UpdateUser): Promise<User> {
    return this.submitRequest<User>(`users/${user.email}`, HttpMethod.PATCH, user);
  }

  find(user: FindUser): Promise<User> {
    return this.submitRequest<User>(`users/${user.email}`, HttpMethod.GET);
  }

  findAll(): Promise<User[]> {
    return this.submitRequest<User[]>('users', HttpMethod.GET);
  }

  remove(user: RemoveUser): Promise<void> {
    return this.submitRequest<void>(`users/${user.email}`, HttpMethod.DELETE);
  }
}
