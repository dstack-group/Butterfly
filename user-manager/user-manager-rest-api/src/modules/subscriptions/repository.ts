import { Database } from '../../database';
import { SubscriptionQueryProvider } from './SubscriptionQueryProvider';
import sqlProvider from './sql';
import { CreateSubscription, Subscription } from './entity';

export class SubscriptionRepository {
  private database: Database;
  private sqlProvider: SubscriptionQueryProvider;

  constructor(database: Database) {
    this.database = database;
    this.sqlProvider = sqlProvider;
  }

  createSubscription(params: CreateSubscription): Promise<Subscription> {
    return this.database.one(this.sqlProvider.create, params) as Promise<Subscription>;
  }
}
