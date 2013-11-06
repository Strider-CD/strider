
var everypaas = require('everypaas')
  , _ = require('underscore')
  , path = require('path')

var envDefaults = {

    port: process.env.PORT || 3000
  , server_name : 'http://localhost'

  , db_uri :  everypaas.getMongodbUrl() || "mongodb://localhost/strider-foss"

  , smtp_host : ''
  , smtp_port : 587
  , smtp_user : ''
  , smtp_pass : ''
  , smtp_from : "Strider <noreply@stridercd.com>"

  , enablePty : false
  , extpath : 'node_modules'
  , session_secret : "8L8BudMkqBUqrz"

  , github_app_id : ''
  , github_secret : ''

  , cors : false

}
envDefaults.server_name = envDefaults.server_name + ":" + envDefaults.port

var defaults = _.extend({
  // Logging configuration
  logging: {
    exitOnError: true,
    loggly_enabled: false,
    file_enabled: false,
    console: {
      // Log everything
      level: 0,
      colorize: true,
      timestamp: true
    },
    console_enabled: true
  },
  viewpath: path.join(__dirname, '../views')
}, envDefaults)

module.exports = {
  defaults: defaults,
  deprecated: deprecated,
  smtp: smtp,
  filterEnv: filterEnv,
  addPlugins: addPlugins,
  camel: camel,
  getConfig: getConfig
}

// main function. Get the config, using rc
function getConfig() {
  process.env = filterEnv(deprecated(process.env), envDefaults)
  var rc = require('rc')('strider', defaults)
  if (!rc.smtp) rc.smtp = smtp(rc)
  addPlugins(rc, process.env)
  // BACK COMPAT until we get strider config into plugins...
  if (rc.plugins.github) {
    rc.plugins.github.hostname = rc.server_name
  }
  return rc
}

function camel(words) {
  return words[0] + words.slice(1).map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join('')
}

function addPlugins(rc, env) {
  var parts
  if (!rc.plugins) rc.plugins = {}
  for (var key in env) {
    if (!key.match(/^plugin_/i)) continue;
    parts = key.toLowerCase().split('_')
    if (parts.length === 2) {
      try {
        rc.plugins[parts[1]] = JSON.parse(env[key])
      } catch (e) {
        console.warn("Ignoring config because it's not valid JSON: ", key, env[key])
      }
      continue;
    }
    if (!rc.plugins[parts[1]]) rc.plugins[parts[1]] = {}
    rc.plugins[parts[1]][camel(parts.slice(2))] = env[key]
  }
}

// Filter process.env.FOO to process.env.strider_foo for rc's benefit
function filterEnv(env, defaults) {
  var res = {}
  for (var k in env) {
    if (defaults[k.toLowerCase()] !== undefined)  {
      res["strider_" + k.toLowerCase()] = env[k]
    } else {
      res[k] = env[k]
    }
  }
  return res
}

function deprecated(env) {
  var nenv = _.extend({}, env)
  if (env.APP_ID) {
    console.warn("WARNING: You are using APP_ID to configure Github OAuth application id.")
    console.warn("This name has been deprecated. Please use PLUGIN_GITHUB_APP_ID instead.\n")
    nenv.PLUGIN_GITHUB_APP_ID = env.APP_ID
  }
  if (env.APP_SECRET) {
    console.warn("WARNING: You are using APP_SECRET to configure Github OAuth application secret.")
    console.warn("This name has been deprecated. Please use PLUGIN_GITHUB_APP_SECRET instead.\n")
    nenv.PLUGIN_GITHUB_APP_SECRET = env.APP_SECRET
  }
  if (env.GITHUB_APP_ID) {
    console.warn("WARNING: You are using GITHUB_APP_ID to configure Github OAuth application id.")
    console.warn("This name has been deprecated. Please use PLUGIN_GITHUB_APP_ID instead.\n")
    nenv.PLUGIN_GITHUB_APP_ID = env.GITHUB_APP_ID
  }
  if (env.GITHUB_SECRET) {
    console.warn("WARNING: You are using GITHUB_SECRET to configure Github OAuth application secret.")
    console.warn("This name has been deprecated. Please use PLUGIN_GITHUB_APP_SECRET instead.\n")
    nenv.PLUGIN_GITHUB_APP_SECRET = env.GITHUB_SECRET
  }
  if (env.GITHUB_API_ENDPOINT) {
    console.warn("WARNING: You are using GITHUB_API_ENDPOINT to configure Github API base URL.")
    console.warn("This name has been deprecated. Please use PLUGIN_GITHUB_API_BASE instead.\n")
    nenv.PLUGIN_GITHUB_API_BASE = env.GITHUB_API_ENDPOINT
  }
  return nenv
}

function smtp(rc) {
  if (!rc.smtp_host) return
  return {
    host: rc.smtp_host,
    port: rc.smtp_port,
    auth: {
      user: rc.smtp_user,
      pass: rc.smtp_pass
    },
    from: rc.smtp_from
  }
}
