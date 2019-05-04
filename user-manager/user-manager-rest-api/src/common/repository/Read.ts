/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  Read.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

/**
 * General contract for the readonly database operations.
 */
export interface Read {
  /**
   * Returns a list of resources that match some given params.
   * @param params params needed to identify a set of resources.
   */
  find<P, R>(params?: P): Promise<R[]>;

  /**
   * Returns a single resource from the given item.
   * If no resource is present, it returns null.
   * @param item the resource to be read.
   */
  findOne<P, R>(params: P): Promise<R|null>;
}
