import { EventReceiversResult } from './entity';
import { SearchRepository } from './repository';
import { Event } from '../../common/Event';

export class SearchManager {
  private repository: SearchRepository;

  constructor(repository: SearchRepository) {
    this.repository = repository;
  }

  async searchReceiversByRecord(event: Event, saveEvent = false): Promise<EventReceiversResult> {
    return this.repository.searchReceiversByRecord(event, saveEvent);
  }
}
