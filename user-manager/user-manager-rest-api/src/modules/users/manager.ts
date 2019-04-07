import { User } from './entity';
import { UserRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class UserManager extends AbstractCRUDManager<User, any, UserRepository> {

  constructor(repository: UserRepository) {
    super(repository);
  }

  findByEmail(user: User): Promise<User> {
    return this.repository.findByEmail(user);
  }

  /*
  async findById(id: string): Promise<User> {
    return this.repository.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findByEmail(email);
  }

  async create(user: CreateUser): Promise<User> {
    return this.repository.create(user);
  }

  async update(user: User): Promise<User> {
    return this.repository.update(user);
  }

  async delete(userId: string): Promise<void> {
    return this.repository.delete(userId);
  }

  async list(offset: number, limit: number): Promise<User[]> {
    return this.repository.list(offset, limit);
  }
  */
}
