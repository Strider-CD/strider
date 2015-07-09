'use strict';

var plugins = global.plugins || [];

module.exports = function($scope) {
  this.busy = false;

  this.hasUpgrades = (function() {
    for (var name in plugins) {
      var plugin = plugins[name];
      if (plugin.outdated) return true;
    }
    return false;
  }());

  this.upgradeAll = function() {
    this.busy = true;
    var ticks = 0;
    var list = [];
    for (var name in plugins) {
      var plugin = plugins[name];
      if (plugin.outdated) list.push(plugin);
    }

    var upgrader = function(i){
      if ( i < list.length ) {
        var pluginCtrl = list[i].controller;
        pluginCtrl.upgrade(function(err) {
          if (err) {
            return global.alert("Batch upgrade aborted due to error:\n"+err.message);
          }
          ++ticks;
          upgrader(i+1);
          if (ticks === list.length) {
            this.busy = false;
            this.hasUpgrades = false;
          }
        }.bind(this));
      }
    }.bind(this);

    upgrader(0);
  }

  this.uninstall = function(plugin) {
    this.busy = true;
    plugin.uninstall(function(err) {
      if (err) {
        global.alert(err.message);
      }
      
      // cleanup plugin in main list
      plugins[plugin.id].installed = false;
      delete plugins[plugin.id].outdated;
      
      this.busy = false;
    }.bind(this))
  }

  this.install = function(plugin) {
    this.busy = true;
    plugin.install(function(err) {
      if (err) {
        global.alert(err.message);
      }

      this.busy = false;
    }.bind(this))
  }

  this.upgrade = function(plugin) {
    this.busy = true;
    plugin.upgrade(function(err) {
      if (err) {
        global.alert(err.message);
      }

      this.busy = false;
    }.bind(this))
  }
}
