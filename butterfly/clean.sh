#/bin/bash

docker run --rm \
  -v /${PWD}:/butterfly \
  -v /${HOME}/.m2:/root/.m2 \
  -w //butterfly \
  maven:3.6-jdk-11-slim mvn clean