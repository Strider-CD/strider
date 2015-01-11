'use strict';

module.exports = function($http, $timeout) {
  this.busy = false;

  this.hasUpgrades = function() {
    $('.autoupgrade').length > 0
  }

  this.upgradeAll = function() {
    $('.autoupgrade').click();
  }

  this.uninstall = function(plugin) {
    this.busy = true;
    plugin.uninstall(function(err) {
      if (err) {
        global.alert(err.message);
      }

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
    plugin.upgrade(function() {
      this.busy = false;
    }.bind(this))
  }
}
