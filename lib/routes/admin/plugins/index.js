var getPluginList = require('./get_plugin_list')
var pluginManager = require('./plugin_manager')
var restart = require('./restart')

module.exports = {
  /* Render a plugin management web interface
   * GET /admin/plugins */
  get: function(req, res, next) {
    getPluginList(function(err, list) {
      if (err) return next(err);
      res.render('admin/plugins.html', {
        plugins: list
      })
    })
  },
  /* Change a plugin (uninstall, install, upgrade)
   * PUT /admin/plugins */
  put: function(req, res, next) {
    pluginManager[req.body.action](req.body.id, function(err) {
      if (err) return res.status(500).end(err.message);
      res.json({ ok: 'restarting strider' })
      restart()
    })
  }
}


