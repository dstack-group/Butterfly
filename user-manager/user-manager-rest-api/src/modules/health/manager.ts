import { AbstractManager } from '../../common/AbstractManager';
import { HealthRepository } from './repository';
import { HealthMetrics } from './entity';

export class HealthManager extends AbstractManager<HealthRepository> {
  constructor(repository: HealthRepository) {
    super(repository);
  }

  getMetrics(): Promise<HealthMetrics> {
    return this.repository.getMetrics();
  }
}
