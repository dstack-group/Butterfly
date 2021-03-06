#/bin/bash

# A single entry point for building, running, stopping and testing Butterfly.

set -e;

JAVA_KAFKA_COMPOSE_FILE=./docker-compose.yml
USER_MANAGER_COMPOSE_FILE=./user-manager/docker-compose.yml
USER_MANAGER_DEV_COMPOSE_FILE=./user-manager/docker-compose.dev.yml

DOCKER_COMPOSE="./docker-compose.sh -f $JAVA_KAFKA_COMPOSE_FILE -f $USER_MANAGER_COMPOSE_FILE"
DOCKER_COMPOSE_DEV="$DOCKER_COMPOSE -f $USER_MANAGER_DEV_COMPOSE_FILE"

print_usage() {
  echo "Usage:
  $0 [OPTIONS] COMMAND

  A single entry point for building, running, stopping and testing Butterfly.

  Options:
    -b|--build            If specified, it creates the Java services' jar executables.
    -h|--help             Show this help.

  Commands:
    install               Install Java services' and User Manager' dependencies.
    prod                  Executes the services in production mode.
    dev                   Executes the services in development mode and spins up
                          utility services too. The utility services are:
                          - pgadmin [localhost:8080];
                          - openapi [localhost:8082].
    prune                 Deletes all the docker virtual networks, volumes and stops
                          the services if they're currently running.
    stop                  Stops the services if they're running.
    ps                    Shows the list of services running.
    logs                  Fetches the logs for a service.
    test                  Executes the test battery.
    sonarcloud            Collects code metrics and uploads them on SonarCloud.
" >&2;
}

print_logs_usage() {
  echo "Usage:
  $0 logs [OPTIONS] SERVICE

  View output from Butterfly containers running on Docker.

  Options:
    -h|--help             Show this help.
" >&2;
}

print_test_usage() {
  echo "Usage:
  $0 test [OPTIONS]

  Executes the test battery.

  Options:
    -h|--help             Show this help.
    -u|--user-manager     Only run User Manager's tests.
" >&2;
}

exec_install() {
  echo "Installing Java services dependencies...";
  cd ./butterfly;
  ./build.sh --install;
  cd ..;

  echo "Installing User Manager dependencies...";
  cd ./user-manager;
  docker-compose -f docker-compose.install.yml down -v;
  docker-compose -f docker-compose.install.yml up --build;
  cd ..;
}

exec_test() {
  exec_stop;
  echo "Executing butterfly tests...";
  
  if [ -z ${SHOULD_TEST_USER_MANAGER_ONLY+x} ]; then
    echo "Building and testing Java modules";
    cd ./butterfly; ./build.sh --clean --install --test; cd ..;
  fi;

  echo "Building and testing User Manager module";
  cd ./user-manager; ./test.sh; cd ..;
}

exec_ps() {
  echo "Showing active services...";
  $DOCKER_COMPOSE_DEV ps;
}

exec_prune() {
  echo "Removing services data...";
  $DOCKER_COMPOSE_DEV down -v;
}

exec_stop() {
  echo "Stopping services...";
  $DOCKER_COMPOSE_DEV down;
}

exec_dev() {
  echo "Running services in development mode...";
  $DOCKER_COMPOSE_DEV up -d --build;
}

exec_prod() {
  echo "Running services in production mode...";
  $DOCKER_COMPOSE up -d --build;
}

exec_logs() {
  LOG_COMMAND="$DOCKER_COMPOSE logs $SERVICE_TO_LOG";

  $LOG_COMMAND;
}

exec_sonarcloud() {
  echo "Collecting SonarCloud code metrics...";
  cd ./butterfly;
  ./sonarcloud.sh $SONAR_PROJECT_KEY $SONAR_PROJECT_ORGANIZATION $SONAR_TOKEN;
  cd ..;
}

# show error if no argument is passed
if [ $# -eq 0 ]; then
  echo "Error: a command is required" >&2;
  print_usage;
  exit 1;
fi

echo "Option: $1";
# parse optional options
case $1 in
  -h|--help) print_usage; exit 0;;
  -b|--build) SHOULD_BUILD=1; shift;;
  -*) "Error: unknown option $1" >&2; print_usage; exit 1;;
esac;

# build Java services if "--build" option was passed
if [ ! -z ${SHOULD_BUILD+x} ]; then
  echo "Building Java services...";
  cd butterfly;
  ./build.sh
  cd ..;
fi

echo "Command: $1";

# parse commands
case $1 in
  install) exec_install;;
  prod) exec_prod;;
  dev) exec_dev;;
  prune) exec_prune;;
  stop) exec_stop;;
  ps) exec_ps;;
  logs) SHOULD_LOG=1; shift;;
  test) SHOULD_TEST=1; shift;;
  sonarcloud) exec_sonarcloud;;
  *) "Error: unknown command $1" >&2; print_usage; exit 1;;
esac;

# parse logs command's options and service name to log
if [ ! -z ${SHOULD_LOG+x} ]; then
  case $1 in
    -h|--help) print_logs_usage; exit 0;;
    -*) "Error: unknown option $1 for \"logs\" command" >&2; print_logs_usage; exit 1;;
    *) SERVICE_TO_LOG="$1";;
  esac;

  exec_logs
fi

echo "Test options: $1";

# parse test command's options
if [ ! -z ${SHOULD_TEST+x} ]; then
  case $1 in
    -h|--help) print_test_usage; exit 0;;
    -u|--user-manager) SHOULD_TEST_USER_MANAGER_ONLY=1;;
    -*) "Error: unknown option $1 for \"test\" command" >&2; print_test_usage; exit 1;;
    ?) "Error: unknown command $1" >&2; print_test_usage; exit 1;;
  esac;

  exec_test
fi
