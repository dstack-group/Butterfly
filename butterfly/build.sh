#/bin/bash

# Tests are disabled by default in order to have faster build times.

print_usage() {
  echo "Usage:
  $0 [MODULE] {-h|-t|-i|}
  
  Commands:
    MODULE               If specified, only compiles that single Maven module.
  
  Options:
    --help,-h            Displays this manual.
    --test,-t            Executes tests. Disabled by default.
    --install,-i         Cleans the artifacts and compiles the project from scratch.
" >&2;
}

INSTALL_COMMAND="";

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) print_usage; exit 0;;
    -t|--test) SHOULD_TEST=1;;
    -i|--install) INSTALL_COMMAND="install";;
    -*) echo "Error: unknown option $1" >&2; print_usage; exit 1;;
    *) MODULE_TO_BUILD="$1"; shift;;
  esac;
  shift;
done

if [ -z $MODULE_TO_BUILD ];
then OPTION="-T5C"; ARGUMENT="$1";
else OPTION="-pl $MODULE_TO_BUILD -T5C"; ARGUMENT="$2"; 
fi

if [ -z $SHOULD_TEST ];
then OPTION+=" -DskipTests";
fi

COMMAND="mvn $INSTALL_COMMAND package $OPTION";
echo "Executing command $COMMAND";

docker run --rm \
  -v /${PWD}:/butterfly \
  -v /${HOME}/.m2:/root/.m2 \
  -v /${PWD}/avro-schemas/target:/butterfly/avro-schemas/target \
  -v /${PWD}/config/target:/butterfly/config/target \
  -v /${PWD}/consumer/target:/butterfly/consumer/target \
  -v /${PWD}/controller/target:/butterfly/controller/target \
  -v /${PWD}/email-consumer/target:/butterfly/email-consumer/target \
  -v /${PWD}/event-processor/target:/butterfly/event-processor/target \
  -v /${PWD}/gitlab-producer/target:/butterfly/gitlab-producer/target \
  -v /${PWD}/producer/target:/butterfly/producer/target \
  -v /${PWD}/redmine-producer/target:/butterfly/redmine-producer/target \
  -v /${PWD}/telegram-consumer/target:/butterfly/telegram-consumer/target \
  -w //butterfly \
  maven:3.6-jdk-11-slim $COMMAND;
