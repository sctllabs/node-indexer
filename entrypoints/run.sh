#!/bin/sh

if [ "$APP_TYPE" == "processor" ]
then
  npm run processor:start
elif [ "$APP_TYPE" == "query-node" ]
then
  npm run query-node:start
fi
