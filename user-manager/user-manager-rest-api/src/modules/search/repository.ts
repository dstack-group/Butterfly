/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  repository.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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
