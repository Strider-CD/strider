
var keypair = require('ssh-keypair')

module.exports = {
  keygen: keygen
}

function keygen(req, res) {
  var branch = req.project.branch(req.params.branch)
  if (!branch) return res.send(404, 'Branch not found')
  keypair(req.project.name + ' - stridercd', function (err, priv, pub) {
    if (err) return res.send(500, 'Failed to generate keypair')
    branch.privkey = priv
    branch.pubkey = pub
    req.project.save(function (err) {
      if (err) return res.send(500, 'Failed to save project')
      res.send({
        privkey: priv,
        pubkey: pub
      })
    })
  })
}

