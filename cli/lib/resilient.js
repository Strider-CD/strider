'use strict';

const cluster = require('cluster');
const chokidar = require('chokidar');
const touch = require('touch');

module.exports = function (deps) {
  const flag = deps.restartFile();

  return {
    restart: function () {
      touch.sync(flag);
      console.log('touched ' + flag);
    },
    spawn: function (work, noCluster) {
      if (noCluster) return work();
      if (cluster.isMaster) {
        const watcher = chokidar.watch(flag);

        cluster.on('online', function (worker) {
          console.log(worker.process.pid + ' forked');
          watcher.removeAllListeners().on('change', function () {
            console.log('restart flag touched');
            worker.kill();
          });
        });

        cluster.on('exit', function (worker, code, signal) {
          console.log(worker.process.pid + ' died', code, signal);
          cluster.fork();
        });

        cluster.fork();
      } else {
        work();
      }
    },
  };
};
