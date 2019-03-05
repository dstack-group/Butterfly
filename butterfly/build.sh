#/bin/bash

docker run --rm \
  -v /${PWD}:/butterfly \
  -v /${HOME}/.m2:/root/.m2 \
  -v /${PWD}/target:/butterfly/target \
  -v /${PWD}/config/target:/butterfly/config/target \
  -v /${PWD}/gitlab-producer/target:/butterfly/gitlab-producer/target \
  -v /${PWD}/producer/target:/butterfly/producer/target \
  -w //butterfly \
  maven:3.6-jdk-11-slim mvn verify package
