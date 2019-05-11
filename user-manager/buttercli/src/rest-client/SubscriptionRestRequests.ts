import { Subscription, CreateSubscription, UpdateSubscription,
         RemoveSubscription, FindSubscription} from './entities/SubscriptionEntities';
import { RestRequestsManager, HttpMethod } from './RestRequestsManager';
import { ServerConfig } from '../database/ServerConfig';

export class SubscriptionRestRequests{

  private manager: RestRequestsManager;
  private path: string;

  constructor(serverConfig: ServerConfig) {
    this.manager = new RestRequestsManager(serverConfig);
    this.path = 'subscriptions';
  }

  create(subscription: CreateSubscription): Promise<Subscription> {
    return this.manager.submitRequest<Subscription>(this.path, HttpMethod.POST, subscription);
  }

  update(subscription: UpdateSubscription): Promise<Subscription> {

    const {userEmail, eventType, projectName, ...payload } = subscription;
    const endpoint = `${this.path}/` + 
                      `users/${subscription.userEmail}/` +
                      `projects/${subscription.projectName}/` +
                      `event-types/${subscription.eventType}`;

    return this.manager.submitRequest<Subscription>(endpoint, HttpMethod.PATCH, payload);
  }

  remove(subscription: RemoveSubscription): Promise<void> {
    const endpoint = `${this.path}/` +
                      `users/${subscription.userEmail}/` +
                      `projects/${subscription.projectName}/` +
                      `event-types/${subscription.eventType}`;1

    return this.manager.submitRequest<void>(endpoint, HttpMethod.DELETE);
  }

  find(subscription: FindSubscription): Promise<Subscription> {
    const endpoint = `${this.path}/` +
                      `users/${subscription.userEmail}/` +
                      `projects/${subscription.projectName}/` +
                      `event-types/${subscription.eventType}`;

    return this.manager.submitRequest<Subscription>(endpoint, HttpMethod.GET);
  }
}
