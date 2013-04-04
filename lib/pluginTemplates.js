var fs = require('fs')
  , path = require('path')

var cache = {};


var registerTemplate = function(name, template, dir){
  cache[name] = function(context){
    if (/\.html$/.test(template)){
      dir = dir || '.'
      template = fs.readFileSync(path.join(dir, template), 'utf8');
    }
    return template
  }
}

var registerBlock = function(block, render){
  cache[block] = render;
}




var getPluginTemplate = function(name){
  return cache[name];
}


var engine = function(path, options, fn){

}


engine.render = function(str, options, fn){
}



module.exports = {
    get : getPluginTemplate
  , registerBlock: registerBlock
  , registerTemplate: registerTemplate
  , engine : engine
}




