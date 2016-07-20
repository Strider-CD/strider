// Object for storing common state between modules.
// TODO: make strider a Class, so we won't need shared globals
module.exports = {
  project_types: {
    'node.js': {
      description: 'nave, npm install, npm test',
      plugins: ['node']
    },
    python: {
      description: 'virtualenv, pip install, ./setup.py test or py.test',
      plugins: ['python']
    },
    ruby: {
      description: 'bundle install, bundle exec rake test',
      plugins: ['ruby']
    },
    go: {
      description: 'go get, go test',
      plugins: ['go']
    },
    web: {
      description: 'sauce, qunit, and jelly to test your javascript in a browser.',
      plugins: ['sauce', 'qunit', 'jelly']
    },
    custom: {
      description: 'Don\'t auto-enable any plugins.',
      plugins: []
    }
  }
};
