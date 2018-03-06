#!/bin/bash

bin/strider install github
bin/strider install bitbucket
bin/strider install gitlab
bin/strider install heroku

bin/strider addUser -a true -l $ACL_ADMIN_PSEUDO -p $ACL_ADMIN_PASSWD -f
