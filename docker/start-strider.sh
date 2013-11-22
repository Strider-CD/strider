#!/bin/bash

env
MONGODB_URI=mongodb://localhost/strider-foss
if [ "$MONGO_PORT" != ""]; then
  MONGODB_URI="mongodb://${MONGO_PORT#tcp://}/strider-foss"
fi
DB_URI=$MONGODB_URI
echo "DB_URI: $MONGODB_URI"
DB_URI=$DB_URI node bin/strider
