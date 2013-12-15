module.exports = function (request) {
  return [ { email: 'test1@example.com'
        , password: 'open-sesame'
        , jar: request.jar()
        , account_level: 0
        , noProjects: true
        }
      , { email: 'test2@example.com'
        , password: 'test'
        , jar: request.jar()
        , account_level: 0
        }
      , { email: 'test3@example.com'
        , password: 'password'
        , jar: request.jar()
        , account_level: 0
        }
      , { email: 'test4@example.com'
        , password: 'password2'
        , jar: request.jar()
        , account_level: 1
        , noProjects: true
        }
      , { email: 'test5@example.com'
        , password: 'password3'
        , jar: request.jar()
        , account_level: 0
        , noProjects: true
        }
      ]
}