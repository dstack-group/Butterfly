import { UserContact, CreateUserContact } from './entity';
import { UserContactRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class UserContactManager extends AbstractCRUDManager<UserContact, any, UserContactRepository> {
  constructor(repository: UserContactRepository) {
    super(repository);
  }
}
