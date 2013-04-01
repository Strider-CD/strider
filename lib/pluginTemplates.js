var cache = {};


var registerTemplate = function(name, template){
  cache[name] = function(context){
    // TODO if template ends in html, load file.
    console.log("TEMPLATE", name, template)
    return template
  }
}

var registerBlock = function(block, render){
  cache[name] = render;
}




var getPluginTemplate = function(name){
  return cache[name];
}

module.exports = {
    get : getPluginTemplate
  , registerBlock: registerBlock
  , registerTemplate: registerTemplate
}
