var cache = {};


var register = function(name, template){
  cache[name] = template; // render
}


var getPluginTemplate = function(name){
  return cache[name];
}

module.exports = {
    get : getPluginTemplate
  , register: register
}
