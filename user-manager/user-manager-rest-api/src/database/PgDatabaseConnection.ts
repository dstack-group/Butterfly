import pgPromiseFactory, { IMain, IDatabase, ITask } from 'pg-promise';
import { DatabaseConnection, DatabaseConnectionValues } from './DatabaseConnection';
import { DatabaseConfig } from './DatabaseConfig';

export interface AnyQuery<T> {
  any: (query: string, values?: DatabaseConnectionValues) => Promise<T[]>;
}

export type GetQueries<T> = (t: AnyQuery<T>) => Array<Promise<T[]>>;

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
  async one<T>(query: string, values?: DatabaseConnectionValues): Promise<T> {
    return this.database.one(query, values);
  }

  /**
   * Executes a query that expects any number of rows.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async any<T>(query: string, values?: DatabaseConnectionValues): Promise<T[]> {
    return this.database.any(query, values);
  }

  /**
   * Executes a query and returns the number of rows affected.
   * @param query the SQL string that contains the query to be run
   * @param values the named value parameters to be passed to the query
   */
  async result(query: string, values?: DatabaseConnectionValues): Promise<number> {
    return this.database.result(query, values, count => count.rowCount);
  }

  /**
   * Shuts down all connection pools created in the process, so it can terminate without delay.
   */
  async close(): Promise<void> {
    // await this.database.$pool.end();
    await this.pgPromise.end();
  }

  /**
   * Executes a batch of queries sharing the same database connection.
   * This method should only be used for test purposes.
   * @param getQueries method that given a task objects, returns a list of queries to execute sharing the
   * same database connection.
   */
  async transaction<T>(getQueries: GetQueries<T>) {
    return new Promise<void>((resolve, reject) => {
      this.database.tx(t => {
        const queries = getQueries(t as AnyQuery<T>);
        return t.batch(queries);
      })
        .then(_ => resolve())
        .catch(error => reject(error));
    });
  }
}
