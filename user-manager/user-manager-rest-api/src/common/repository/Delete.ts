/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  Delete.ts
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
 * General contract for deleting resources from a database.
 */
export interface Delete {
  /**
   * If found, removes the given resource and returns `true`.
   * If no resource is found, it returns `false`.
   * @param item the resource to delete.
   */
  delete<P>(item: P): Promise<boolean>;
}
