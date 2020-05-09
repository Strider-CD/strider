const common = require('../../common');
const debug = require('debug')('strider:routes:api:config');
const ssh = require('../../utils/ssh');

const cache = {};

module.exports = {
  keygen: keygen,
  cacheConfig: cacheConfig,
  server: server,
};

function keygen(req, res) {
  const branch = req.project.branch(req.query.branch);

  if (!branch) return res.status(404).send('Branch not found');

  ssh.generateKeyPair(`${req.project.name} - stridercd`, function (
    err,
    priv,
    pub
  ) {
    if (err) return res.status(500).send('Failed to generate keypair');

    branch.privkey = priv;
    branch.pubkey = pub;

    req.project.save(function (err) {
      if (err) return res.status(500).send('Failed to save project');
      res.send({
        privkey: priv,
        pubkey: pub,
      });
    });
  });
}

function cacheConfig(loader, next) {
  loader.initConfig(function (err, jstext, csstext, configs) {
    if (err) return next(err);

    cache['config'] = {
      js: jstext,
      css: csstext,
    };

    debug('loaded config pages');
    common.pluginConfigs = configs;

    loader.initUserConfig(function (err, jstext, csstext, configs) {
      if (err) return next(err);

      cache['account'] = {
        js: jstext,
        css: csstext,
      };

      debug('loaded account config pages');
      common.userConfigs = configs;

      loader.initStatusBlocks(function (err, jstext, csstext, blocks) {
        if (err) return next(err);

        cache['status'] = {
          js: jstext,
          css: csstext,
        };

        debug('loaded plugin status blocks');
        common.statusBlocks = blocks;
        next();
      });
    });
  });
}

function server(name, which) {
  return function (req, res) {
    res.set('Content-type', `text/${which === 'css' ? 'css' : 'javascript'}`);

    if (!cache['config']) {
      return res
        .status(500)
        .send('looks like config was not compiled correctly');
    }

    res.send(cache[name][which]);
  };
}
