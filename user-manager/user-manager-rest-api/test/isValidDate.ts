/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  isValidDate.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

export const isValidDate = (dateString?: string) => {
  if (dateString == null) {
    return false;
  }

  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
};
