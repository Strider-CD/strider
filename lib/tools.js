
module.exports = {
  camel: camel,
  pluginEnv: pluginEnv,
  filterEnv: filterEnv
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

function camel(words) {
  return words[0] + words.slice(1).map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  })
}

function pluginEnv(env) {
  var plugins = {}
    , plugin
    , parts
  for (var k in env) {
    if (!k.match(/^strider__/i)) continue;
    parts = k.toLowerCase().slice('strider__'.length).split('_')
    plugin = parts[0]
    if (!plugins[plugin]) plugins[plugin] = {}
    plugins[plugin][camel(parts.slice(1))] = env[k]
  }
  return plugins
}
