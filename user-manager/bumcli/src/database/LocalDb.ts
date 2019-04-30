import * as LowDb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

export enum Config {
  Server = 'ServerConfig',
  User = 'UserInfo',
}

export class LocalDb {

  private file: LowDb.AdapterSync;
  private db: LowDb.LowdbSync<LowDb.AdapterSync>;

  constructor(path: string) {

    // TODO: Maybe this check can be improved
    if (path.length === 0) {
      throw Error('Path cannot be empty!');
    }

    this.file = new FileSync(path);
    this.db = LowDb(this.file);

    this.init();
  }

  private init(): void {

    // this.db.defaults() method already checks if the file exists and if it is not empty
    // In these two cases the method does nothing otherwise it creates the json structure
    // TODO: Find if it's possible to loop through the Config enum
    this.db.defaults({ ServerConfig: {}, UserInfo: {} }).write();
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
