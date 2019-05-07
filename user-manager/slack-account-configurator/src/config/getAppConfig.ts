/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  getAppConfig.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { AbstractConfigManager } from './AbstractConfigManager';

export function getAppConfig(configManager: AbstractConfigManager) {
  const NODE_ENV = configManager.getStringProperty('NODE_ENV', 'development');
  const APP_NAME = configManager.getStringProperty('APP_NAME');
  const APP_HOST = configManager.getStringProperty('APP_HOST');
  const APP_PORT = configManager.getIntProperty('APP_PORT');

  const USER_MANAGER_BASE_URL = configManager.getStringProperty('USER_MANAGER_BASE_URL');
  const USER_MANAGER_TIMEOUT = configManager.getIntProperty('USER_MANAGER_TIMEOUT');

  const SLACK_SIGNING_SECRET = configManager.getStringProperty('SLACK_SIGNING_SECRET');
  const SLACK_BOT_TOKEN = configManager.getStringProperty('SLACK_BOT_TOKEN');

  return {
    env: NODE_ENV,
    host: APP_HOST,
    isProduction: NODE_ENV === 'production',
    name: APP_NAME,
    port: APP_PORT,
    slackBotToken: SLACK_BOT_TOKEN,
    slackSigningSecret: SLACK_SIGNING_SECRET,
    userManagerBaseURL: USER_MANAGER_BASE_URL,
    userManagerTimeout: USER_MANAGER_TIMEOUT,
  };
}
