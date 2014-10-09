'use strict';

var $ = require('jquery');

function post(url, data, done) {
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    dataType: 'json',
    success: function (data, ts, xhr) {
      done(null);
    },
    error: function (xhr, ts, e) {
      if (xhr && xhr.responseText) {
        var data = $.parseJSON(xhr.responseText);
        e = data.errors[0];
      }
      done(e);
    }
  });
}

module.exports = post;
