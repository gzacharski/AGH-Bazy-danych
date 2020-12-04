#!/bin/bash

set -m

/docker-entrypoint.sh neo4j &

for try in $(seq 1 20); do
  tmpFile=$(mktemp)
  cypher-shell -u neo4j -p test -f /createNorthwind.cql &> "${tmpFile}"
  if [ $? == 0 ]; then
    echo "Successfully created database"
    break
  fi
  if grep -q "Database already exists" "${tmpFile}"; then
    echo "Database already exists"
    break
  fi
  echo "Try number $try to create database failed"
  sleep 10
done

fg %1