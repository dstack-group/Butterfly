/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  asyncRetry.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import pRetry from 'p-retry';

export interface AsyncRetry<T> {
  input: (attempts: number) => Promise<T>;
  retries: number;
  maxTimeout: number;
}

export const asyncRetry = async <T> (params: AsyncRetry<T>) => {
  const { input, retries, maxTimeout } = params;
  return await pRetry(input, {
    maxTimeout,
    retries,
  });
};
