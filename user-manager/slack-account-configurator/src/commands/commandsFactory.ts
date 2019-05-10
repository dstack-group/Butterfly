/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  commandsFactory.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { EmailCommand } from '.';
import { CommandParams } from './CommandParams';
import { CommandMiddleware } from './CommandMiddleware';

export function commandsFactory(params: CommandParams) {
  const emailCommand = new EmailCommand(params);

  return new Map<string, CommandMiddleware>([
    ['/email', emailCommand.command],
  ]);
}
