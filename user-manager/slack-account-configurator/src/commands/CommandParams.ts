/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  CommandParams.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { UserManagerHTTPClient } from '../user-manager-client/interfaces/UserManagerHTTPClient';
import { Logger } from '../logger';

export interface CommandParams {
  logger: Logger;
  client: UserManagerHTTPClient;
}
