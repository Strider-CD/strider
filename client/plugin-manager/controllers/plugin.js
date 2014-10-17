'use strict';

module.exports = function($http, $timeout) {
  this.idle = true
  this.status = 'idle'

  this.loadPlugin = function(id) {
    this.id = id
    this.plugin = plugins[id]
    for (var key in this.plugin) {
      this[key] = this.plugin[key]
    }
    this.pluginLoaded = true;
  }

  this.upgrade = function(cb) {
    this.perform('upgrade', function() {
      this.installed = true;
      this.outdated = false;
      this.installedVersion = this.latestVersion;
      cb();
    }.bind(this))
  }

  this.install = function(cb) {
    this.perform('install', function() {
      this.installed = true;
      this.installedVersion = this.latestVersion;
      cb();
    }.bind(this))
  }

  this.uninstall = function(cb) {
    this.perform('uninstall', function(err) {
      if (err) return cb(err)
      this.installed = false;
      this.installedVersion = 'no';
      cb();
    }.bind(this))
  }

  this.perform = function(action, cb) {
    this.status = 'requesting '+action
    this.idle = false;
    return $http.put('/admin/plugins', {
      action: action,
      id: this.id
    }).success(function(data, status, headers, config) {
      this.status = action+' in progress';
      $timeout(function() {
        waitForRestart(function() {
          this.status = 'done'
          this.idle = true
          cb()
        }.bind(this))
      }.bind(this), 2000)
    }.bind(this)).error(function(data, status, headers, config) {
      this.idle = true;
      cb(new Error(data))
    }.bind(this))
  }

  var waitForRestart = function(cb) {
    $http.head('/').success(function() {
      cb()
    }).error(function() {
      waitForRestart(cb)
    })
  }
}
