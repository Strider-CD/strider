
// instead of "about %d hours"
$.timeago.settings.strings.hour = 'an hour';
$.timeago.settings.strings.hours = '%d hours';
$.timeago.settings.localeTitle = true;

function textDuration(duration, el) {
  if (!duration) return $(el).text('--');
  var cls = '', text;
  if (duration >= 60 * 60 * 1000) {
    cls = 'hours';
    text = parseInt(duration / 60 / 60 / 100) / 10 + 'h';
  } else if (duration >= 60 * 1000) {
    cls = 'minutes';
    text = parseInt(duration / 60 / 100) / 10 + 'm';
  } else if (duration >= 1000) {
    cls = 'seconds';
    text = parseInt(duration / 100) / 10 + 's';
  } else {
    cls = 'miliseconds';
    text = duration + 'ms';
  }
  $(el).addClass(cls).text(text);
}

function since(stamp, el) {
  var then = new Date(stamp).getTime();
  function update() {
    var now = new Date().getTime();
    textDuration(now - then, el);
  }
  update();
  return setInterval(update, 500);
}

var app = angular.module('moment', []);

// timeago directive
app.directive("time", function() {
  return {
    restrict: "E",
    link: function(scope, element, attrs) {
      if ('undefined' !== typeof attrs.since) {
        var ival = since(attrs.since, element);
        $(element).tooltip({title: 'Started ' + new Date(attrs.since).toLocaleString()});
        return scope.$on('$destroy', function () {
          clearInterval(ival);
        });
      }

      var date
      if ('undefined' !== typeof attrs.datetime) {
        date = new Date(attrs.datetime);
        $(element).tooltip({title: date.toLocaleString()});
      }
      
      if ('undefined' !== typeof attrs.duration) {
        return textDuration(attrs.duration, element);
      }

      // TODO: use moment.js
      $(element).text($.timeago(date));
      setTimeout(function () {
        $(element).timeago();
      }, 0);
    }
  };
}).directive("toggle", function($compile) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      if (attrs.toggle !== 'tooltip') return;
      setTimeout(function() {
        $(element).tooltip();
      }, 0);
      attrs.$observe('title', function () {
        $(element).tooltip();
      });
    }
  };
});
