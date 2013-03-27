var jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')

var includeJade = function(indent, parser){
  var template = (this.args[1] || this.args[0]).replace(/"/g, '')
    , f = fs.readFileSync(path.join(config.viewpath, template), 'utf8')
    , temp= jade.compile(f)({})
  temp = temp.replace(/(\r\n|\n|\r)/gm, ''); // Strip newlines
  temp = temp.replace(/'/g, "\\\'")
  console.log(temp)
  var out = "_output += '" + temp + "';\n"; // SWIG custom tags are MESSY!
  return out
}
includeJade.ends = false;



module.exports = {
  includeJade : includeJade
}
