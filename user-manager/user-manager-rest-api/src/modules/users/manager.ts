import { UserRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class UserManager extends AbstractCRUDManager<any, UserRepository> {
  constructor(repository: UserRepository) {
    super(repository);
  }
}
