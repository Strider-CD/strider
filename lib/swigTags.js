var jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')

var includeJade = function(indent, parser){
  var template = (this.args[1] || this.args[0]).replace(/"/g, '')
    , p = path.join(config.viewpath, template)
    , f = fs.readFileSync(p, 'utf8')
    , temp = jade.compile(f, {filename: p})({})

  temp = temp.replace(/(\r\n|\n|\r)/gm, ''); // Strip newlines
  temp = temp.replace(/'/g, "\\\'")
  var out = "_output += '" + temp + "';\n"; // SWIG custom tags are MESSY!
  return out
}
includeJade.ends = false;



module.exports = {
  includeJade : includeJade
}
