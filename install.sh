#!/bin/bash

bin/strider install github
bin/strider install bitbucket
bin/strider install gitlab
bin/strider install heroku

bin/strider addUser -a true -l $ACL_ADMIN_PSEUDO -p $ACL_ADMIN_PASSWD -f

npm install strider-{email-notifier,status-report,metadata,mail,slack,custom,python,ruby}
npm install strider-{docker-{build,slave},remote-worker,ssh-deploy,{simple,docker,digitalocean}-runner}
