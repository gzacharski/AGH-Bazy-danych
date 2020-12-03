#!/usr/bin/env bash

docker exec aghbazydanych_neo4j-db_1 cat /createNorthwind.cql | cypher-shell -u neo4j -p test
