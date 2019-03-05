import * as path from 'path';
import { getSQLFile } from '../../../utils/getSQLFile';

export = {
  create: sql('./create.sql'),
  delete: sql('./delete.sql'),
  findByEmail: sql('./findByEmail.sql'),
  findById: sql('./findById.sql'),
  list: sql('./list.sql'),
  update: sql('./update.sql'),
};

function sql(relativeFilename: string) {
  const fullPath = path.join(__dirname, relativeFilename);
  return getSQLFile(fullPath);
}
