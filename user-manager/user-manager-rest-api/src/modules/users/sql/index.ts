import { getSQLFile } from '../../../utils/getSQLFile';

const dirName = __dirname;

export = {
  create: sql('./create.sql'),
  delete: sql('./delete.sql'),
  findByEmail: sql('./findByEmail.sql'),
  findById: sql('./findById.sql'),
  list: sql('./list.sql'),
  update: sql('./update.sql'),
};

function sql(relativeFilename: string) {
  return getSQLFile(dirName, relativeFilename);
}
