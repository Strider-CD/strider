module.exports = function() {
  var fs = require('fs')
  var yaml = require ('js-yaml')
  var fetchRepos = require('./fetch_github_repos')
  var url = 'https://api.github.com/orgs/Strider-CD/repos?per_page=100'
  fetchRepos(url).then(function (repos) {
    repos.forEach(function (repo) {
      var file = '/Users/keyvan/Projects/Strider-CD/strider-plugins/plugins/'+repo.name
      fs.writeFile(file, yaml.dump(repo))
    })
  }).error(errHandle).catch(errHandle)
}

function errHandle(err) {
  console.error('Error!\n'+err.message+'\n'+err.stack)
}
