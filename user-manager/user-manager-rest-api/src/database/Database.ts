import { DatabaseConfig } from './DatabaseConfig';
import pgPromiseFactory, { IMain, IDatabase } from 'pg-promise';

export type DatabaseConnection = IDatabase<{}>;

/**
 * Database class wrapper that
 */
export class Database {
  private config: DatabaseConfig;
  private pgPromise: IMain;
  private database: DatabaseConnection;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.pgPromise = pgPromiseFactory();
    this.database = this.pgPromise(this.config);
  }

  async isConnected(): Promise<boolean> {
    try {
      const db = this.getConnection();
      await db.any('SELECT NOW()');
      return true;
    } catch (error) {
      return false;
    }
  }

  async close(): Promise<void> {
    console.log('CLOSING DATABASE');
    await this.database.$pool.end();
    await this.pgPromise.end();
  }

  /**
   * TODO: We should provide an adapter for the interface IDatabase<T> in order to better decouple
   * this class from `pg-promise`.
   */
  getConnection(): DatabaseConnection {
    return this.database;
  }
}
