/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  Write.ts
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
 * General contract for the database operations that create or modify resources.
 */
export interface Write {
  /**
   * Creates a new resource and returns it.
   * @param params the named parameters needed to create a new resource.
   */
  create<P, R>(params: P): Promise<R>;

  /**
   * Updates an existing resource and returns it.
   * If no resource is present, it returns null.
   * @param params the named paramters to be used to update a resource.
   */
  update<P, R>(params: P): Promise<R|null>;
}
