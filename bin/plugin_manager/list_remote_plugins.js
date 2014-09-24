module.exports = function() {
  var yaml = require ('js-yaml')
  var remote = require('./remote_plugins')
  //var url = 'https://raw.githubusercontent.com/Strider-CD/strider-plugins/master/index'
  var url = 'http://localhost:8000/index'
  remote.fetchIndex(url).then(function (items) {
    items.forEach(function (item) {
      console.log(item)
    })
  }).error(errHandle).catch(errHandle)
}

function errHandle(err) {
  console.error('Error!\n'+err.message+'\n'+err.stack)
}
