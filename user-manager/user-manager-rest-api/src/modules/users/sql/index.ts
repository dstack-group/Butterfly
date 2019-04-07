import { getSQLFile } from '../../../utils/getSQLFile';
import { UserQueryProvider } from '../UserQueryProvider';

const dirName = __dirname;

const queryProvider: UserQueryProvider = {
  // list: sql('./list.sql'),
  create: sql('./create.sql'),
  delete: sql('./delete.sql'),
  find: sql('find.sql'),
  findByEmail: sql('./findByEmail.sql'),
  findOne: sql('./findByOne.sql'),
  update: sql('./update.sql'),
};

export default queryProvider;

function sql(relativeFilename: string) {
  return getSQLFile(dirName, relativeFilename);
}
