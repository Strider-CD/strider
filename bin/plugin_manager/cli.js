module.exports = function (parser) {
  parser.command('ls')
  .help('List locally installed plugins')
  .callback(function(opts){
    require('./list_local_plugins')()
  })

  //parser.command('lsr')
  //.help('List official strider plugins available on github')
  //.callback(function(opts){
  //  listOfficialPlugins()
  //})
}
