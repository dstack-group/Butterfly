import { getSQLFile } from '../../../utils/getSQLFile';
import { UserContactQueryProvider } from '../UserContactQueryProvider';

const dirName = __dirname;

const queryProvider: UserContactQueryProvider = {
  // list: sql('./list.sql'),
  create: sql('./create.sql'),
  delete: sql('./delete.sql'),
  find: sql('find.sql'),
  findOne: sql('./findOne.sql'),
  update: sql('./update.sql'),
};

export default queryProvider;

function sql(relativeFilename: string) {
  return getSQLFile(dirName, relativeFilename);
}
