import { getSQLFile } from '../../../utils/getSQLFile';

const directoryName = __dirname;
export = {
  searchUsersFromEvent: sql('./searchUsersFromEvent.sql'),
};

function sql(relativeFilename: string) {
  return getSQLFile(directoryName, relativeFilename);
}
