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
