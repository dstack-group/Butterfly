import { EventWithRecipients } from './entity';
import sqlProvider from './sql';
import { Database } from '../../database';
import { Event } from '../../common/Event';

export class SearchRepository {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async searchUsersFromEvent(event: Event): Promise<EventWithRecipients> {
    return await this.database.one(sqlProvider.searchUsersFromEvent, event);
  }
}
