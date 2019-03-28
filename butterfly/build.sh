#/bin/bash

docker run --rm \
  -v /${PWD}:/butterfly \
  -v /${HOME}/.m2:/root/.m2 \
  -v /${PWD}/target:/butterfly/target \
  -v /${PWD}/common/target:/butterfly/common/target \
  -v /${PWD}/consumer/target:/butterfly/consumer/target \
  -v /${PWD}/email-consumer/target:/butterfly/email-consumer/target \
  -v /${PWD}/gitlab-producer/target:/butterfly/gitlab-producer/target \
  -v /${PWD}/producer/target:/butterfly/producer/target \
  -v /${PWD}/redmine-producer/target:/butterfly/redmine-producer/target \
  -v /${PWD}/telegram-consumer/target:/butterfly/telegram-consumer/target \
  -w //butterfly \
  maven:3.6-jdk-11-slim mvn verify package
