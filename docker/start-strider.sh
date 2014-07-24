#!/bin/bash

env
if [ -n "$DB_URI" ]; then
  MONGODB_URI=${DB_URI}
elif [ -z "$MONGODB_URI" ]; then
  MONGODB_URI=mongodb://localhost/strider-foss
fi
if [ -n "$MONGO_PORT" ]; then
  MONGODB_URI="mongodb://${MONGO_PORT#tcp://}/strider-foss"
fi
DB_URI=$MONGODB_URI
# TODO: make this work with arbitrary plugin_* vars
HOME=/home/strider SERVER_NAME=$SERVER_NAME SMTP_HOST=$SMTP_HOST SMTP_USER=$SMTP_USER SMTP_PASS=$SMTP_PASS SMTP_FROM=$SMTP_FROM PLUGIN_GITHUB_APP_ID=$PLUGIN_GITHUB_APP_ID PLUGIN_GITHUB_SECRET=$PLUGIN_GITHUB_SECRET DB_URI=$DB_URI NODE_ENV=production strider
