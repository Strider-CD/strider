'use strict';

// Plugin block is the tag used to specify that the
// contents can be overridden by extensions.
var pluginBlock = function (indent, parser){
  var template = this.args[0]
    , output = '';

  // Register that the template is needed, for 1st pass;
  output += '_context._striderRegister.push(\'' + template + '\');\n';


  // Generate code to see if pluginTemplates has block
  output += 'var _pg = _context._striderBlocks[\'' + template + '\'];\n';
  output += 'if (_pg){ ';
  output += '_output += _pg;';
  output += '} else {\n';
  output += parser.compile.call(this, indent + ' ');
  output += '}\n';

  return output;
};
pluginBlock.ends = true;



module.exports = {
  tags: {
    pluginblock: pluginBlock
  }
};
