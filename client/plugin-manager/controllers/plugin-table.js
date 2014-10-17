'use strict';

module.exports = function($http, $timeout) {
  this.busy = false;

  this.uninstall = function(plugin) {
    this.busy = true;
    plugin.uninstall(function(err) {
      if (err) alert(err.message);
      this.busy = false;
    }.bind(this))
  }

  this.install = function(plugin) {
    this.busy = true;
    plugin.install(function() {
      this.busy = false;
    }.bind(this))
  }

  this.upgrade = function(plugin) {
    this.busy = true;
    plugin.upgrade(function() {
      this.busy = false;
    }.bind(this))
  }
}
