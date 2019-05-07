/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  EmailCommand.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { SlackCommand } from '../SlackCommand';
import { CommandMiddleware } from '../CommandMiddleware';
import { CreateUserContactClient } from '../../user-manager-client/interfaces/CreateUserContactClient';
import { CommandParams } from '../CommandParams';
import { Logger } from '../../logger';
import { validateUserEmail } from './validator';
import { validate } from '../../validation';
import { ConflictError } from '../../user-manager-client/errors/ConflictError';
import { TimeoutError } from '../../user-manager-client/errors/TimeoutError';

export class EmailCommand implements SlackCommand {
  private client: CreateUserContactClient;
  private logger: Logger;

  constructor(params: CommandParams) {
    this.client = params.client;
    this.logger = params.logger;
  }

  command: CommandMiddleware = async ({ ack, respond, body }) => {
    this.logger.info(`Email middleware called AAA: ${body.user_id}, ${body.channel_id}, ${body.text}, ${body.token}`);
    // Slack requires that each command acknowledges the request within a 3-second timespan.
    ack();

    // if the given input isn't a valid email, the User Manager isn't even involved
    const { value: userEmail, error: validationError } = validate(body.text, validateUserEmail);

    let responseText: string;

    if (validationError) {
      responseText = `${body.text} isn't a valid email`;
    } else {
      try {
        /**
         * Creates a new Slack account in the User Manager
         */
        await this.client.createUserContact({
          contactRef: body.user_id,
          userEmail,
        });

        responseText = `Successfully added a new Slack Account for ${userEmail}.`;
      } catch (error) {
        this.logger.error(`Error: ${error}`);
        if (error instanceof ConflictError) {
          responseText = `Another Slack Account is already configured for the user identified by ${userEmail}.`;
        } else if (error instanceof TimeoutError) {
          responseText = `Can't contact Butterfly's User Manager service. Please try again later.`;
        } else {
          responseText = `Unexpected error. Please contact an administrator.`;
        }
      }
    }

    /**
     * Replies to the user privately on Slack, the other members of the channel won't be able to see this response.
     */
    respond({
      response_type: 'ephemeral',
      text: responseText,
    });
  }
}
