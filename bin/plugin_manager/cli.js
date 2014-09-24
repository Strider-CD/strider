module.exports = function (parser) {
  parser.command('ls')
  .help('List locally installed plugins')
  .callback(function(opts){
    require('./list_local_plugins')()
  })

  parser.command('lsr')
  .help('List remote plugins available for install')
  .callback(function(opts){
    require('./list_remote_plugins')()
  })
}
