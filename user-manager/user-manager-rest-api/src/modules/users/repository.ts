import { User } from './entity';
import sqlProvider from './sql';
import { Database, DatabaseConnection } from '../../database';
import { CreateUser } from './model';

export class UserRepository {
  private database: Database;
  private connection: DatabaseConnection;

  constructor(database: Database) {
    this.database = database;
    this.connection = this.database.getConnection();
  }

  async create(user: CreateUser): Promise<User> {
    return await this.connection.one(sqlProvider.create, user);
  }

  async delete(userId: string): Promise<void> {
    await this.connection.none(sqlProvider.delete, userId);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.connection.one(sqlProvider.findByEmail, {
      email,
    });
  }

  async findById(userId: string): Promise<User> {
    return await this.connection.one(sqlProvider.findById, {
      userId,
    });
  }

  async list(limit: number, offset: number): Promise<User[]> {
    return await this.connection.many(sqlProvider.list, {
      limit,
      offset,
    });
  }

  async update(user: User): Promise<User> {
    return await this.connection.one(sqlProvider.update, user);
  }
}
