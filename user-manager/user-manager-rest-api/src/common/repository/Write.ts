/**
 * General contract for the database operations that create or modify resources.
 */
export interface Write<T> {
  /**
   * Creates a new resource and returns it.
   * @param item the resource to be created.
   */
  create(item: T): Promise<T>;

  /**
   * Updates an existing resource and returns it.
   * @param item the resource to be updated.
   */
  update(item: T): Promise<T>;
}
