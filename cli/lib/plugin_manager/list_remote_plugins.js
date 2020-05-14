const _ = require('lodash');
const Table = require('cli-table3');
const debug = require('debug')('strider:cli');

module.exports = function (pluginsPath) {
  const table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    head: ['name', 'description', 'stable', 'installed'],
  });

  const local = require('./local_plugins')(pluginsPath);

  const client = require('strider-ecosystem-client');

  client
    .fetchPlugins()
    .then(function (remotePlugins) {
      local.listAllZipped(function (err, localPlugins) {
        Object.keys(remotePlugins).forEach(function (name) {
          const remote = remotePlugins[name];
          const local = localPlugins[name];
          debug(remote);
          table.push([
            name,
            remote.description,
            remote.tag,
            local ? local.version : 'no',
          ]);
        });
        console.log(table.toString());
      });
    })
    .error(errHandle)
    .catch(errHandle);
};

function errHandle(err) {
  console.error('Error!\n' + err.message + '\n' + err.stack);
}
