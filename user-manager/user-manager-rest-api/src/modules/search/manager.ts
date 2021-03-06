/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  manager.ts
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
import { SearchRepository } from './repository';
import { Event } from '../../common/Event';

export class SearchManager {
  private repository: SearchRepository;

  constructor(repository: SearchRepository) {
    this.repository = repository;
  }

  searchReceiversByRecord(event: Event, saveEvent = false): Promise<EventReceiversResult> {
    /**
     * TODO: if no result is returned, the event should be probably sent to an admin.
     * Should we put this logic in the User Manager or in the Middleware Dispatcher?
     */
    return this.repository.searchReceiversByRecord(event, saveEvent) as Promise<EventReceiversResult>;
  }
}
