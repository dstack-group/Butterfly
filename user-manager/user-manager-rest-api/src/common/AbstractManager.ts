export abstract class AbstractManager<T> {
  protected repository: T;

  constructor(repository: T) {
    this.repository = repository;
  }
}
