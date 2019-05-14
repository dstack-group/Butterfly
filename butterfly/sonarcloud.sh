#/bin/bash

SONAR_PROJECT_KEY=$1;
SONAR_PROJECT_ORGANIZATION=$2;
SONAR_TOKEN=$3;

if [ -z ${SONAR_TOKEN+x} ]; then
  echo "Missing SonarCloud token";
  exit 1;
fi

docker run --rm \
  -v "/${PWD}":/butterfly \
  -v "/${HOME}/.m2":/root/.m2 \
  -w //butterfly \
  maven:3.6-jdk-11-slim mvn sonar:sonar \
    -Dsonar.projectKey=$SONAR_PROJECT_KEY \
    -Dsonar.organization=$SONAR_PROJECT_ORGANIZATION \
    -Dsonar.host.url=https://sonarcloud.io \
    -Dsonar.login=$SONAR_TOKEN;
