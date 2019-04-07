export interface DatabaseConnectionValues {
  [key: string]: any;
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
   * Executes a query that expects exactly one row of data. When 0 or more than 1 rows are returned,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  one<T>(query: string, values?: DatabaseConnectionValues): Promise<T>;

  /**
   * Executes a query that expects any number of rows.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  any<T>(query: string, values?: DatabaseConnectionValues): Promise<T[]>;

  /**
   * Executes a query against a stored procedure via its name.
   * @param procedureName the name of the stored procedure to call
   * @param values the named value parameters to be passed to the stored procedure
   */
  proc(procedureName: string, values?: DatabaseConnectionValues): Promise<void>;

  /**
   * Shuts down all connection pools created in the process, so it can terminate without delay.
   */
  close(): Promise<void>;
}
