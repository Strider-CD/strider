var jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')
  , pluginTemplates = require('./plugin-templates')

var includeJade = function(args){
  var template = (args[1] || args[0]).replace(/"/g, '')
    , p = path.join(config.viewpath, template)
    , f = fs.readFileSync(p, 'utf8')
    , temp = jade.compile(f, {filename: p})({})
  return temp
}
includeJade.ends = false;



// Plugin block is the tag used to specify that the 
// contents can be overridden by extensions.
var pluginBlock = function(indent, parser){
  var template = this.args[0]
    , output = ""

  // Register that the template is needed, for 1st pass;
  output += "_context._striderRegister.push('" + template + "');\n";


  // Generate code to see if pluginTemplates has block
  output += "var _pg = _context._striderBlocks['" + template + "'];\n"
  output += "if (_pg){ "
  output += "_output += _pg;"
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
