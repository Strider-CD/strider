'use strict';

var keypair = require('ssh-keypair');
var common = require('../../common');

module.exports = {
  keygen: keygen,
  cacheConfig: cacheConfig,
  server: server
}

function keygen(req, res) {
  var branch = req.project.branch(req.query.branch)
  if (!branch) return res.send(404, 'Branch not found')
  keypair(req.project.name + ' - stridercd', function (err, priv, pub) {
    if (err) return res.send(500, 'Failed to generate keypair')
    branch.privkey = priv
    branch.pubkey = pub
    req.project.save(function (err) {
      if (err) return res.send(500, 'Failed to save project')
      res.send({
        privkey: priv,
        pubkey: pub
      })
    })
  })
}

var cache = {};

function cacheConfig(loader, next) {
  var base = '../../public/';

  loader.initConfig(function (err, jstext, csstext, configs) {
    if (err) return next(err)

    cache['config'] = {
      js: jstext,
      css: csstext
    }

    console.log('loaded config pages')
    common.pluginConfigs = configs

    loader.initUserConfig(function (err, jstext, csstext, configs) {
      if (err) return next(err)

      cache['account'] = {
        js: jstext,
        css: csstext
      }

      console.log('loaded account config pages')
      common.userConfigs = configs

      loader.initStatusBlocks(function (err, jstext, csstext, blocks) {
        if (err) return next(err)

        cache['status'] = {
          js: jstext,
          css: csstext
        }

        console.log('loaded plugin status blocks')
        common.statusBlocks = blocks
        next()
      })
    })
  })
}

function server(name, which) {
  return function (req, res) {
    res.set('Content-type', 'text/' + (which === 'css' ? 'css' : 'javascript'))

    if (!cache['config']) {
      return res.send(500, 'looks like config was not compiled correctly')
    }

    res.send(cache[name][which])
  }
}
