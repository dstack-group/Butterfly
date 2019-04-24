import { UserContactRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class UserContactManager extends AbstractCRUDManager<any, UserContactRepository> {
  constructor(repository: UserContactRepository) {
    super(repository);
  }
}
