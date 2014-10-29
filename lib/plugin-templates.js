'use strict';

var fs = require('fs');
var path = require('path');
var swig = require('swig');
var async = require('async');

// TODO - better name - this is block:func plugin map
var cache = {};

// Generate func for string template names
function registerTemplate (name, template, dir) {
  cache[name] = function (context, cb) {
    if (/\.html$/.test(template)){
      dir = dir || '.'
      template = fs.readFileSync(path.join(dir, template), 'utf8');
    }

    cb(null, template);
  }
}


function registerBlock(block, render) {
  cache[block] = render;
}


// This generates a generator that will
// render the appropriate block in a form
// suitable for async.parallel.
function getPluginTemplate(name) {
  var ctx = this;

  return function (cb) {
    if (cache[name]){
      cache[name](ctx, function (err, res) {
        if (err) return cb(err);
        cb(null, [name, res]);
      });
    } else {
      cb(null, null);
    }
  }
}


// Express 3 Template Engine
function engine(path, options, fn) {
  //console.log("Plugin Engine () :", path);
  options.filename = path;

  fs.readFile(path, 'utf8', function (err, str) {
    if (err) return fn(err);
    engine.render(str, options, fn);
  });
}

// This Render function is a bit complicated, as we're essentially
// monkeypatching swig.render to async collect the appropriate
// extension blocks, render them, and then render them into the
// template.
//
// Because we don't know which blocks are on which page, we actually
// end up rendering the template twice - first to work out which
// blocks are needed, and second, to actually insert them.
engine.render = function (str, options, fn) {
  try {
    // Compile
    options._striderRegister = [] // register of templates needed
    options._striderBlocks = {} // output of pluginblocks

    var tmpl = swig.compile(str, options);

    // Which plugins were needed?
    // Render 1st pass
    tmpl(options);
    var exts = options._striderRegister.map(getPluginTemplate, options);

    // Call each block of plugin
    async.parallel(exts, function(err, blocks){
      if (err) return fn(err);

      for (var i=0; i< blocks.length; i++){ 
        if (blocks[i]){
          options._striderBlocks[blocks[i][0]] = blocks[i][1];
        }
      }

      // Render template with the _striderBlocks
      fn(null, tmpl(options));
    });


  } catch (err) {
    fn(err);
  }
};



module.exports = {
  registerBlock: registerBlock,
  registerTemplate: registerTemplate,
  engine: engine
};
