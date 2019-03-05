import * as path from 'path';
import { getSQLFile } from '../../../utils/getSQLFile';

export = {
  searchUsersFromEvent: sql('./searchUsersFromEvent.sql'),
};

function sql(relativeFilename: string) {
  const fullPath = path.join(__dirname, relativeFilename);
  return getSQLFile(fullPath);
}
