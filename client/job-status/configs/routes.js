'use strict';

module.exports = function ($locationProvider, $routeProvider) {
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
    $routeProvider.when(path, routes[path]);
  });

  // route.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
};
