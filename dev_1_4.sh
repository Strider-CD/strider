#!/bin/bash

# simple script to set up an environment to hack on 1.4.
# installs all strider-* deps as git clone's from the 1_4_refactor branch.

# you can hack on them by editing under node_moduldes/strider-foo

DEPS="strider-custom strider-python strider-node strider-env strider-sauce strider-simple-runner strider-extension-loader"

# NOTE: There are other modules we should make sure work with 1.4 too:
# DEPS="$DEPS strider-jelly strider-qunit strider-browserstack"

BASE="git@github.com:/Strider-CD"

mkdir -p node_modules

for module in $DEPS
do
    git clone -b 1_4_refactor $BASE/$module node_modules/$module
    (cd node_modules/$module && npm install)
done

npm i

echo "> 1.4 is set up! Hack on modules under node_modules. They are git repos!"
