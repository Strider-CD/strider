var jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')

var includeJade = function(args){
  var template = (args[1] || args[0]).replace(/"/g, '')
    , p = path.join(config.viewpath, template)
    , f = fs.readFileSync(p, 'utf8')
    , temp = jade.compile(f, {filename: p})({})
  return temp
}
includeJade.ends = false;




var pluginBlock = function(args){
  return "[PLUGIN]"
}
pluginBlock.ends = true;



module.exports = {
  tags: {}
  , simpleTags : {
      includeJade: includeJade
    , pluginblock: pluginBlock}
}
