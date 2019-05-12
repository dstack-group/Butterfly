import lowDb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export enum Config {
  Server = 'ServerConfig',
  User = 'UserInfo',
}

export class LocalDb {

  private file: lowDb.AdapterSync;
  private db: lowDb.LowdbSync<lowDb.AdapterSync>;

  constructor(path: string) {

    // TODO: Maybe this check can be improved
    if (path.length === 0) {
      throw Error('Path cannot be empty!');
    }

    this.file = new FileSync(path);
    this.db = lowDb(this.file);

    this.init();
  }

  private init(): void {

    // this.db.defaults() method already checks if the file exists and if it is not empty
    // In these two cases the method does nothing otherwise it creates the json structure

    /*
     * FAILED ATTEMPT: defaults() not use correctly my json
     * Build the db structure automatically looping through the Config enum
     * and extract all the name sets. In this way I need only touch the Config enum
     * and the structure is build correctly
     * TODO: Maybe is useful to check if file exists (even if defaults() already checks that)
     *       so this method doesn't build the dbStructure every time
     */
    /*
    const nameSets: string[] = Object.keys(Config);
    let dbStructure: string = '{';

    forIn (Config, value => {
      dbStructure = dbStructure.concat(` '${value}': {},`);
    });

    // Remove last char ',' and append the chars ' }'
    dbStructure = dbStructure.slice(0, -1).concat(' }');
    console.log(dbStructure);
    this.db.defaults(JSON.parse(dbStructure)).write();
    */

    this.db.defaults({ UserInfo: {}, ServerConfig: {}}).write();
  }

  // TODO: The return type? value() returns any
  getValues(nameSet: Config) {
    if (this.db.has(nameSet).value()) {
      return this.db.get(nameSet).value();
    }
  }

  setValues(nameSet: Config, values: object): void {
    if (this.db.has(nameSet).value()) {
      this.db.set(nameSet, values).write();
    }
  }
}
