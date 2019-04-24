/**
 * General contract for the readonly database operations.
 */
export interface Read<T> {
  /**
   * Returns a list of resources that match some given params.
   * @param params params needed to identify a set of resources.
   */
  find<V>(params?: V): Promise<T[]>;

  /**
   * Returns a single resource from the given item.
   * If no resource is present, it returns null.
   * @param item the resource to be read.
   */
  findOne<V>(item: V): Promise<T|null>;
}
