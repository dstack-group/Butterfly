/**
 * General contract for deleting resources from a database.
 */
export interface Delete<T> {
  /**
   * If found, removes the given resource and returns `true`.
   * If no resource is found, it returns `false`.
   * @param item the resource to delete.
   */
  delete(item: T): Promise<boolean>;
}
