import { EventReceiversResult } from './entity';
import { Database } from '../../database';
import { Event } from '../../common/Event';
import { SearchQueryProvider } from './SearchQueryProvider';
import sqlProvider from './sql';

export class SearchRepository {
  private database: Database;
  private sqlProvider: SearchQueryProvider;

  constructor(database: Database) {
    this.database = database;
    this.sqlProvider = sqlProvider;
  }

  async searchReceiversByRecord(event: Event, saveEvent: boolean): Promise<EventReceiversResult|null> {
    return await this.database.one(this.sqlProvider.searchReceiversByRecord, { event, saveEvent });
  }
}
