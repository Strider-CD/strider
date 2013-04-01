var jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')
  , pluginTemplates = require('./pluginTemplates')

var includeJade = function(args){
  var template = (args[1] || args[0]).replace(/"/g, '')
    , p = path.join(config.viewpath, template)
    , f = fs.readFileSync(p, 'utf8')
    , temp = jade.compile(f, {filename: p})({})
  return temp
}
includeJade.ends = false;


var pluginBlock = function(indent, parser){
  var template = this.args[0]
    , output = ""

  output += "var _pg = _ext.plugin.get;\n"
  output += "if (_pg('" + template + "')){ "
  output += "_output += _pg('" + template + "')(_context);"
  output += "} else {\n"
  output += parser.compile.call(this, indent + ' ');
  output += "}\n"

  return output;  
}
pluginBlock.ends = true;



module.exports = {
  tags: {
    pluginblock: pluginBlock
  }
  , simpleTags : {
      includeJade: includeJade
  }
}
