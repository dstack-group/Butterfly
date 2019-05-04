/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  copyStaticAssets.js
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

const cpFile = require('cp-file');
const fg = require('fast-glob');

(async () => {
  const srcEntries = await fg(['src/modules/**/sql/*.sql']);
  // const distEntries = srcEntries.map(entry => `dist${entry.substring(3)}`);
  const promisesFactory = srcEntries.map(srcEntry => {
    const distEntry = `dist${srcEntry.substring(3)}`;
    return new Promise((resolve, reject) => {
      cpFile(srcEntry, distEntry)
        .then(() => {
          console.log(`Copied ${srcEntry} into ${distEntry}`);
          resolve();
        })
        .catch(err => reject(err));
    });
  });

  await Promise.all(promisesFactory);
})();
