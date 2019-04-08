import * as path from 'path';
import { as, QueryFile, TQueryFileOptions } from 'pg-promise';

export function getSQLFile(directoryName: string, relativeFilename: string, schema = 'public'): string {
  const fullPath = path.join(directoryName, relativeFilename);

  const options: TQueryFileOptions = {
    minify: true,
    params: {
      schema, // replaces ${schema~} with the value of the `schema` argument
    },
  };

  const queryFile: QueryFile = new QueryFile(fullPath, options);

  if (queryFile.error) {
    // Something is wrong with our query file :(
    // Testing all files through queries can be cumbersome,
    // so we also report it here, while loading the module:
    // tslint:disable-next-line:no-console
    console.error(queryFile.error);
  }

  // @ts-ignore
  return queryFile[as.ctf.toPostgres]();
}
