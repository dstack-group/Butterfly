import { DatabaseConnection, DatabaseConnectionValues } from './DatabaseConnection';

/**
 * Database class adapter that acts as a Facade for the given DatabaseConnection.
 */
export class Database implements DatabaseConnection {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.connection.any('SELECT NOW()');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Executes a query that expects no data to be returned. If the query returns any kind of data,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async none(query: string, values?: DatabaseConnectionValues): Promise<void> {
    await this.connection.none(query, values);
  }

  /**
   * Executes a query that expects exactly one row of data. When 0 or more than 1 rows are returned,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async one<T = any>(query: string, values?: DatabaseConnectionValues): Promise<T> {
    return this.connection.one(query, values);
  }

  /**
   * Executes a query that expects any number of rows.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async any<T = any>(query: string, values?: DatabaseConnectionValues): Promise<T[]> {
    return this.connection.any(query, values);
  }

  /**
   * Executes a query and returns the number of rows affected.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async result(query: string, values?: DatabaseConnectionValues): Promise<number> {
    return this.connection.result(query, values);
  }

  /**
   * Shuts down all connection pools created in the process, so it can terminate without delay.
   */
  async close(): Promise<void> {
    await this.connection.close();
  }
}
