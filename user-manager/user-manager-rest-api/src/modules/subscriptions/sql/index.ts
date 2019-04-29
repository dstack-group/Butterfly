/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  index.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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
