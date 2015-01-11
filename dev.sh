#!/bin/bash

# simple script to set up an environment to hack on.
# installs all strider-* deps as git clone's from the master branch.

# you can hack on them by editing under node_moduldes/strider-foo

ARGS=$@
case "${ARGS[@]}" in *"--sudo-link"*) SUDOLINK="sudo" ;; esac
case "${ARGS[@]}" in *"--ignore-link-fail"*) IGNORELINKFAIL="YES" ;; esac

npm install lodash
DEPS=$(node -e "var _ = require('lodash'), deps = _.keys(require('./package').dependencies); console.log(_.filter(deps, function(i){ return /^strider-/.test(i) }).join(' '));")

BASE="git@github.com:Strider-CD"

mkdir -p node_modules


for module in $DEPS
do
  if [ ! -d ../$module ]; then
    git clone $BASE/$module ../$module
  fi
  pushd ../$module
  npm i
  popd
  if [ ! -L $PWD/node_modules/$module ]; then
    $SUDOLINK npm link ../$module
    if [ $? != 0 ]; then
      echo "Failed to link $module"
      if [ -z $SUDOLINK ]; then
        echo "You may need to use root for npm link, pass in --sudo-link to run the command with sudo."
      fi
      if [ -z $IGNORELINKFAIL ]; then
        echo "If you want to ignore link failures, pass in --ignore-link-fail"
        exit -1
      fi
    fi
  fi
done

npm i

echo "> Strider is set up! Hack on modules under node_modules. They are git repos!"
