import { getSQLFile } from '../../../utils/getSQLFile';
import { ProjectQueryProvider } from '../ProjectQueryProvider';

const dirName = __dirname;

const queryProvider: ProjectQueryProvider = {
  create: sql('./create.sql'),
  delete: sql('./delete.sql'),
  find: sql('./find.sql'),
  findOne: sql('findOne.sql'),
  removeServiceURL: sql('./removeServiceURL.sql'),
  update: sql('./update.sql'),
};

export default queryProvider;

function sql(relativeFilename: string) {
  return getSQLFile(dirName, relativeFilename);
}
