/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  DatabaseConnection.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

export interface DatabaseConnectionValues {
  [key: string]: unknown;
}

/**
 * DatabaseConnection defines the features that a database client should offer.
 */
export interface DatabaseConnection {
  /**
   * Executes a query that expects no data to be returned. If the query returns any kind of data,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  none(query: string, values?: DatabaseConnectionValues): Promise<void>;

  /**
   * Executes a query that expects exactly one row of data. When no row is returned,
   * the method returns null. When more than 1 rows are returned,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  one<T>(query: string, values?: DatabaseConnectionValues): Promise<T|null>;

  /**
   * Executes a query that expects any number of rows.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  any<T>(query: string, values?: DatabaseConnectionValues): Promise<T[]>;

  /**
   * Executes a query and returns the number of rows affected.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  result(query: string, values?: DatabaseConnectionValues): Promise<number>;

  /**
   * Shuts down all connection pools created in the process, so it can terminate without delay.
   */
  close(): Promise<void>;
}
