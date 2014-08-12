'use strict';

module.exports = function (interp, location, route) {
  interp.startSymbol('[[');
  interp.endSymbol(']]');
  var one = {
    controller: 'JobCtrl',
    templateUrl: 'build-tpl.html'
  };
  var routes = {
    '/': one,
    '/job/latest': one,
    '/job/:id': one
  };

  Object.keys(routes).forEach(function (path) {
    route.when(path, routes[path]);
  });

  // route.otherwise({redirectTo: '/'});
  location.html5Mode(true);
};
