import { User } from './entity';
import { UserRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class UserManager extends AbstractCRUDManager<User, any, UserRepository> {
  constructor(repository: UserRepository) {
    super(repository);
  }
}
