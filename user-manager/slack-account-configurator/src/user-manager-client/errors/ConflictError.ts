/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  ConflictError.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

export class ConflictError extends Error {
  constructor() {
    super('ConflictError');
  }
}
