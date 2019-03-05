import { EventWithRecipients } from './entity';
import { SearchRepository } from './repository';
import { Event } from '../common/Event';

export class SearchManager {
  private repository: SearchRepository;

  constructor(repository: SearchRepository) {
    this.repository = repository;
  }

  async searchUsersFromEvent(event: Event): Promise<EventWithRecipients> {
    return this.repository.searchUsersFromEvent(event);
  }
}
