#/bin/bash

# Tests are disabled by default in order to have faster build times.

print_usage() {
  echo "Usage:
  $0 [MODULE] {-h|-c|-t|-i|}
  
  Commands:
    MODULE               If specified, only compiles that single Maven module.
  
  Options:
    --help,-h            Displays this manual.
    --clean,-c           Clears the target folders.
    --test,-t            Executes tests. Disabled by default. When it is enabled,
                         parallel compilation is prevented.
    --install,-i         Cleans the artifacts and compiles the project from scratch.
" >&2;
}

SUBCOMMAND="";

while [ "$#" -gt 0 ]; do
  case $1 in
    -h|--help) print_usage; exit 0;;
    -c|--clean) SUBCOMMAND="$SUBCOMMAND clean ";;
    -t|--test) SHOULD_TEST=1;;
    -i|--install) SUBCOMMAND="$SUBCOMMAND install ";;
    -*) echo "Error: unknown option $1" >&2; print_usage; exit 1;;
    *) MODULE_TO_BUILD="$1"; shift;;
  esac;
  shift;
done

if [ -z $MODULE_TO_BUILD ];
then
  if [ -z $SHOULD_TEST ]
  then OPTION="-T5C";
  fi
  ARGUMENT="$1";
else OPTION="-pl $MODULE_TO_BUILD -T5C"; ARGUMENT="$2"; 
fi

if [ -z $SHOULD_TEST ];
then OPTION=" $OPTION -DskipTests";
fi

COMMAND="mvn checkstyle:check ${SUBCOMMAND}package $OPTION";
echo "Executing command $COMMAND";

docker run --rm \
  -v "/${PWD}":/butterfly \
  -v "/${HOME}/.m2":/root/.m2 \
  -w //butterfly \
  maven:3.6-jdk-11-slim $COMMAND;
