import { User } from './entity';
import { UserRepository } from './repository';
import { CreateUser } from './model';

export class UserManager {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

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
}
