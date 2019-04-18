/**
 * General contract for the database operations that create or modify resources.
 */
export interface Write<T> {
  /**
   * Creates a new resource and returns it.
   * @param item the resource to be created.
   */
  create<V>(item: V): Promise<T>;

  /**
   * Updates an existing resource and returns it.
   * @param item the resource to be updated.
   */
  update<V>(item: V): Promise<T>;
}
