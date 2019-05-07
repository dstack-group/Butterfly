/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  setup.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Server } from './server/Server';
import { ServerConfig } from './server/ServerConfig';
import { Logger } from './logger';
import { commandsFactory } from './commands';
import { getAppConfig, AbstractConfigManager } from './config';
import { UserManagerHTTPClient } from './user-manager-client/interfaces/UserManagerHTTPClient';
import { UserManagerClient } from './user-manager-client';

export interface SetupParams {
  configManager: AbstractConfigManager;
  logger: Logger;
}

export async function setup(params: SetupParams) {
  const {
    configManager,
    logger,
  } = params;

  const config = getAppConfig(configManager);

  const userManagerClient = new UserManagerClient({
    baseURL: config.userManagerBaseURL,
    timeout: config.userManagerTimeout,
  });

  const serverConfig: ServerConfig = {
    commandsFactory,
    logger,
    port: config.port,
    signingSecret: config.slackSigningSecret,
    slackToken: config.slackBotToken,
    userManagerClient,
  };

  const app = new Server(serverConfig);
  const server = await app.createServer();

  return {
    app,
    server,
  };
}
