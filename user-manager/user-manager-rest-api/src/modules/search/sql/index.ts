import { getSQLFile } from '../../../utils/getSQLFile';

const directoryName = __dirname;
export = {
  searchReceiversByRecord: sql('./searchReceiversByRecord.sql'),
};

function sql(relativeFilename: string) {
  return getSQLFile(directoryName, relativeFilename);
}
