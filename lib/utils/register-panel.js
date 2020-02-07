var debug = require('debug')('strider:register-panel');

// ### Register panel
//
// A panel is simply a snippet of HTML associated with a given key.
// Strider will output panels registered for specific template.
//
module.exports = function setupRegisterPanel(common) {
  return function registerPanel(key, value) {
    // Nothing yet registered for this panel
    key = value.id;
    debug('!! registerPanel', key);

    if (common.extensions[key] === undefined) {
      common.extensions[key] = { panel: value };
    } else {
      if (common.extensions[key].panel) {
        debug('!!', key, common.extensions[key], value);
        throw `Multiple Panels for ${key}`;
      }

      common.extensions[key].panel = value;
    }
  };
};
