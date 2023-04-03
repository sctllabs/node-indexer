#!/usr/bin/env bash
# This script is meant to be run on Unix/Linux based systems
set -e

echo "*** Preparing environment ***"

yarn install --frozen-lockfile

make build

echo "*** Start Societal Application ***"

mkdir -p .local

docker-compose -f docker-compose-full.yml down --remove-orphans
docker-compose -f docker-compose-full.yml up -d

echo "*** Waiting for containers to start ***"

# Making sure the DB containers are up and running
sleep 10

make migrate
