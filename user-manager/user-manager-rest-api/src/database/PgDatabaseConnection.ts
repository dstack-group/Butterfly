import pgPromiseFactory, { IMain, IDatabase } from 'pg-promise';
import { DatabaseConnection, DatabaseConnectionValues } from './DatabaseConnection';
import { DatabaseConfig } from './DatabaseConfig';

/**
 * PgDatabaseConnection is a Postgres-oriented implementation of DatabaseConnection.
 * Internally, it uses `pg-promise` as database client.
 */
export class PgDatabaseConnection implements DatabaseConnection {
  private config: DatabaseConfig;
  private pgPromise: IMain;
  private database: IDatabase<{}>;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.pgPromise = pgPromiseFactory();
    this.database = this.pgPromise(this.config);
  }

  /**
   * Executes a query that expects no data to be returned. If the query returns any kind of data,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async none(query: string, values?: DatabaseConnectionValues): Promise<void> {
    await this.database.none(query, values);
  }

  /**
   * Executes a query that expects exactly one row of data. When 0 or more than 1 rows are returned,
   * the method rejects.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async one<T = any>(query: string, values?: DatabaseConnectionValues): Promise<T> {
    return this.database.one(query, values);
  }

  /**
   * Executes a query that expects any number of rows.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async any<T = any>(query: string, values?: DatabaseConnectionValues): Promise<T[]> {
    return this.database.any(query, values);
  }

  /**
   * Executes a query against a stored procedure via its name.
   * @param procedureName the name of the stored procedure to call
   * @param values the named value parameters to be passed to the stored procedure
   */
  async proc(procedureName: string, values?: DatabaseConnectionValues): Promise<void> {
    await this.database.proc(procedureName, values);
  }

  /**
   * Shuts down all connection pools created in the process, so it can terminate without delay.
   */
  async close(): Promise<void> {
    await this.database.$pool.end();
    await this.pgPromise.end();
  }
}
