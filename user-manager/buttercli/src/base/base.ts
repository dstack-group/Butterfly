import { Command, flags } from '@oclif/command';
import { Table, cli } from 'cli-ux';
import { LocalDb, Config } from '../database/LocalDb';
import * as fs from 'fs';
import * as path from 'path';

export type TableColumns<T extends {}> = Table.table.Columns<T>;
const { extended } = cli.table.flags();

export abstract class BaseCommand extends Command {

  // @ts-ignore
  protected db: LocalDb;

  static flags = {
    extended,
    help: flags.help({ char: 'h' }),
    json: flags.boolean({ char: 'j', description: 'display results in json format' }),
  };

  async init() {

    const dbPath: string = path.join(this.config.configDir, 'db.json');

    // Check if the db exists
    fs.access(dbPath, fs.constants.F_OK, error => {
      if (error) {
        error.message = `Local db not found at ${dbPath}\n `;
        error.message += `Make sure that the directory exist!\n `;
        error.message += `Use "buttercli init" command to create the db`;
        throw error;
      }
    });

    // Open db
    this.db = new LocalDb(dbPath);

    // Check if the db contains the right json structure
    if (JSON.stringify(this.db.getValues(Config.Server)) === '{}') {
      let message = 'The server connection is not correctly configured!\n ';
      message += 'Use "buttercli init" command to initialize the db';
      this.error(message);
    }
  }

  private print<T>(data: T[]): void {
    (data.length === 0) ?
      this.log('Ops! Empty result') :
      this.log(this.showJSONFormat(data));
  }

  // Test if the array is a "single response" like create and find
  private showJSONFormat<T>(data: T[]): string {
    return (data.length === 1) ?
      JSON.stringify(data[0], null, 2) :
      JSON.stringify(data, null, 2);
  }

  // New function: print che table with the passed result and header
  private printTable<T extends {}>(result: T[], columns: TableColumns<T>) {
    return cli.table(result, columns, {});
  }

  /**
   * New function, check if the flag jsonEnabled are True or False
   * True  => call print that show the raw JSON
   * False => call the printTable that show the result inside a table
   */
  protected showResult<T extends {}>(result: T[], columns: TableColumns<T>, jsonEnabled: boolean): void {
    (jsonEnabled) ?
      this.print(result) :
      this.printTable(result, columns);
  }

  protected showError(error: Error) {
    this.error(`Operation failed:\n ${error.message}`);
  }
}
