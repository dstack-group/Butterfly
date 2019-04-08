import { User } from './entity';
import sqlProvider from './sql';
import { Database } from '../../database';
import { AbstractCRUDRepository } from '../../common/repository/AbstractCRUDRepository';
import { UserQueryProvider } from './UserQueryProvider';

export class UserRepository extends AbstractCRUDRepository<User, UserQueryProvider> {
  constructor(database: Database) {
    super(database, sqlProvider);
  }

  findByEmail(user: User): Promise<User> {
    return this.database.one(sqlProvider.findByEmail, user);
  }
}

/*
export class UserRepository {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async create(user: CreateUser): Promise<User> {
    return await this.database.one(sqlProvider.create, user);
  }

  async delete(userId: string): Promise<void> {
    await this.database.none(sqlProvider.delete, {
      userId,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.database.one(sqlProvider.findByEmail, {
      email,
    });
  }

  async findById(userId: string): Promise<User> {
    return await this.database.one(sqlProvider.findById, {
      userId,
    });
  }

  async list(limit: number, offset: number): Promise<User[]> {
    return await this.database.any(sqlProvider.list, {
      limit,
      offset,
    });
  }

  async update(user: User): Promise<User> {
    return await this.database.one(sqlProvider.update, user);
  }
}
*/
