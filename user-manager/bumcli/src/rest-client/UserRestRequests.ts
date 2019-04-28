import { User, CreateUser, UpdateUser, FindUser, RemoveUser } from './entities/UserEntities';
import { RestRequests } from './RestRequests';


export class UserRestRequests extends RestRequests {

  create(user: CreateUser): Promise<User> {
    return this.submitRequest<User>("users", 'POST', user);
  }

  update(user: UpdateUser): Promise<User> {
    return this.submitRequest<User>("users/" + user.email, 'PATCH', user);
  }

  find(user: FindUser): Promise<User> {
    return this.submitRequest<User>("users/" + user.email, 'GET');
  }

  findAll(): Promise<User[]> {
    return this.submitRequest<User[]>("users", 'GET');
  }

  remove(user: RemoveUser): void {
    this.submitRequest<void>("users/" + user.email, 'DELETE');
  }
}
