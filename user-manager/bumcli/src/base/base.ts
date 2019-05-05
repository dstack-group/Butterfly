import { Command, flags } from '@oclif/command';
import { Table, cli } from 'cli-ux'
import { LocalDb } from '../database/LocalDb';

export type TableColumns<T extends {}> = Table.table.Columns<T>;

export abstract class BaseCommand extends Command {

  // @ts-ignore
  protected db: LocalDb;

  static flags = {
    help: flags.help({char: 'h'}),
    json: flags.boolean({char: 'j', description: 'display results in json format'}),
  }

  async init() {
    // Path must be changed (${this.config.configDir}): its temporary and only for test
    this.db = new LocalDb(`db.json`);
  }

  /*
  protected print(data: object | object, jsonEnabled: boolean): void {
    (jsonEnabled) ?
      this.log(this.showJSONFormat(data)) :
      this.log('table');
  }*/


  //Update: Moved here the Error condition because here do the check if 
  protected print<T>(data: T[]): void {
    (data.length === 0) ?
      this.log(`Ops! Empty result`) :
       this.log(this.showJSONFormat(data))
  }

  //Update: insereted the condition if the array is a "single response" like create and find 
  private showJSONFormat<T>(data: T[]): string {
    return (data.length === 1) ?
     JSON.stringify(data[0], null, 2) :
      JSON.stringify(data, null, 2);
  }


  // New function: print che table with the passed result and header
  protected printTable<T extends {}>(result: T[], columns: TableColumns<T>){
    return cli.table(result,columns,{})
  }

  /* New function, check if the flag jsonEnabled are True or False.
   * True  => call print that show the raw JSON
   * False => call the printTable that show the result inside a table  
  */
  protected showResult<T extends{}>(result: T[], columns: TableColumns<T>, jsonEnabled: boolean): void
  {
    (jsonEnabled) ? 
    this.print(result) : 
    this.printTable(result,columns)
  }
}
