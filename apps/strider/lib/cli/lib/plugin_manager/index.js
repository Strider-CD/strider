module.exports = function (pluginsPath) {
  return {
    listLocal: function () {
      return require('./list_local_plugins')(pluginsPath);
    },
    listRemote: function () {
      return require('./list_remote_plugins')(pluginsPath);
    },
    createNew: function () {
      return require('./create_new_plugin')(pluginsPath);
    },
    install: function (name, cb) {
      return require('./install_plugin')(pluginsPath)(name, cb);
    },
    uninstall: function (name, cb) {
      return require('./uninstall_plugin')(pluginsPath)(name, cb);
    },
    upgrade: function (name, cb) {
      return require('./upgrade_plugin')(pluginsPath)(name, cb);
    },
  };
};
