import { QueryFile, TQueryFileOptions } from 'pg-promise';

export function getSQLFile(fullPath: string, schema = 'public') {
  const options: TQueryFileOptions = {
    minify: true,
    params: {
      schema, // replaces ${schema~} with 'public'
    },
  };

  const qf: QueryFile = new QueryFile(fullPath, options);

  if (qf.error) {
    // Something is wrong with our query file :(
    // Testing all files through queries can be cumbersome,
    // so we also report it here, while loading the module:
    console.error(qf.error);
  }

  return qf;
}
