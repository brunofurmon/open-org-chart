#!/bin/sh

if [ ! -d node_modules ]; then
    echo "No modules found. Running installation."
    yarn
    test -z "$USER_PERM" || chown -R $USER_PERM node_modules
fi

yarn debug
