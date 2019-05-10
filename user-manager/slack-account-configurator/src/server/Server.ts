/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  Server.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { App as SlackApp } from '@slack/bolt';
import { Server as HTTPServer } from 'http';
import { ServerConfig } from './ServerConfig';
import { Logger } from '../logger';

// TODO: add tests as in https://github.com/slackapi/bolt/blob/master/src/App.spec.ts

export class Server {
  private slackApp: SlackApp;
  private config: ServerConfig;
  private logger: Logger;

  constructor(config: ServerConfig) {
    this.config = config;
    this.logger = config.logger;
    this.slackApp = new SlackApp({
      signingSecret: config.signingSecret,
      token: config.slackToken,
    });
  }

  async createServer(): Promise<HTTPServer> {
    this.logger.info('Starting server...');
    this.setupMiddlewares();
    const server = await this.slackApp.start(this.config.port);
    this.logger.info('Server started');
    return server as HTTPServer;
  }

  async closeServer(): Promise<void> {
    this.logger.info('Closing server...');
    await this.slackApp.stop();
    this.logger.info('Server closed');
  }

  private setupMiddlewares() {
    const commands = this.config.commandsFactory({
      client: this.config.userManagerClient,
      logger: this.config.logger,
    });
    commands.forEach((command, name) => {
      this.logger.info(`Adding command: ${name}`);
      this.slackApp.command(name, command);
    });
  }
}
