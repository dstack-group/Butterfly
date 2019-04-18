import { Subscription, CreateSubscription } from './entity';
import { SubscriptionRepository } from './repository';

export class SubscriptionManager {
  private repository: SubscriptionRepository;

  constructor(repository: SubscriptionRepository) {
    this.repository = repository;
  }

  async createSubscription(params: CreateSubscription): Promise<Subscription> {
    return this.repository.createSubscription(params);
  }
}
