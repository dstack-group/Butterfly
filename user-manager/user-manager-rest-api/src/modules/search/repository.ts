import { EventWithRecipients } from './entity';
import sqlProvider from './sql';
import { Database, DatabaseConnection } from '../../database';
import { Event } from '../common/Event';

export class SearchRepository {
  private database: Database;
  private connection: DatabaseConnection;

  constructor(database: Database) {
    this.database = database;
    this.connection = this.database.getConnection();
  }

  async searchUsersFromEvent(event: Event): Promise<EventWithRecipients> {
    return await this.connection.one(sqlProvider.searchUsersFromEvent, event);
  }
}
