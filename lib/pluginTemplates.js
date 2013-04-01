var cache = {};


var registerTemplate = function(name, template){
  cache[name] = function(context){
    // TODO if template ends in html, load file.
    return template
  }
}

var registerBlock = function(block, render){
  cache[block] = render;
}




var getPluginTemplate = function(name){
  return cache[name];
}

module.exports = {
    get : getPluginTemplate
  , registerBlock: registerBlock
  , registerTemplate: registerTemplate
}
