import { getSQLFile } from '../../../utils/getSQLFile';
import { SubscriptionQueryProvider } from '../SubscriptionQueryProvider';

const dirName = __dirname;

const queryProvider: SubscriptionQueryProvider = {
  create: sql('./create.sql'),
};

export default queryProvider;

function sql(relativeFilename: string) {
  return getSQLFile(dirName, relativeFilename);
}
