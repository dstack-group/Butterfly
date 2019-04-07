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
   * @param item the resource to be read.
   */
  findOne(item: T): Promise<T>;
}
