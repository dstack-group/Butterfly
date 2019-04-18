/**
 * General contract for deleting resources from a database.
 */
export interface Delete {
  /**
   * If found, removes the given resource and returns `true`.
   * If no resource is found, it returns `false`.
   * @param item the resource to delete.
   */
  delete<V>(item: V): Promise<boolean>;
}
