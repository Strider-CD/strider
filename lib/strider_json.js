//var debug = require('tailbug')('/Users/keyvan/tmpfile')
//debug('\n\n\n')

module.exports = striderJson

function striderJson(provider, project, ref, done) {
  if (!provider.hosted) {
    return provider.getFile('strider.json', ref, project.provider.config, project, finished)
  }

  var account = project.creator.account(project.provider.id, project.provider.account)
  provider.getFile('strider.json', ref, account, project.provider.config, project, finished)

  function finished(err, contents) {
    if (err || !contents) return done({})
    var data = {}
    try {
      data = JSON.parse(contents)
      var data = buildConfig(data)
    } catch (e) {
      console.warn('Strider config is invalid JSON for', project, ref)
      console.log(contents)
    }
    done(data)
  }
}

function buildConfig(obj) {
  // there are 2 modes, simple and normal
  // simple mode check is based on if a top level key "test" exists
  // otherwise we default to normal mode which is essentially the same as performing a last-minute 'import' of the branches and their configurations per the strider.json file, which is expected to have been an 'export' of branches and their configurations
  var keys = Object.keys(obj)

  if (keys.indexOf('test')) {
    //debug("simple mode!")
    obj = createSimpleModeConfig(obj)
  } else {
    //debug('normal mode!')
  }

  return obj;
}

function createSimpleModeConfig(obj){
  // this will always override any other plugins, including custom scripts
  // if you need more advanced functionality you should use export/import + normal mode (Coming later)
  var dog_undef = typeof obj.deploy_on_green === "undefined"
  var dog = dog_undef ? true : obj.deploy_on_green
  return { 
    deploy_on_green: dog,
    plugins: [{
      config: obj,
      id: 'custom',
      enabled: true,
      showStatus: true
    }]
  }
}
