/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  ServerConfig.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { CommandMiddleware } from '../commands/CommandMiddleware';
import { CommandParams } from '../commands/CommandParams';
import { Logger } from '../logger';
import { UserManagerHTTPClient } from '../user-manager-client/interfaces/UserManagerHTTPClient';

export interface ServerConfig {
  logger: Logger;
  commandsFactory: (params: CommandParams) => Map<string, CommandMiddleware>;
  port: number;
  signingSecret: string;
  slackToken: string;
  userManagerClient: UserManagerHTTPClient;
}
