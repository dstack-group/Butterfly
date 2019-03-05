#/bin/bash
SERVICE=$1
COMPOSE_FILE=$SERVICE/docker-compose.yml

case "$2" in
  "start")
    docker-compose -f $COMPOSE_FILE up -d
    ;;
  "start-new")
    docker-compose -f $COMPOSE_FILE up --build -d
    ;;
  "stop")
    docker-compose -f $COMPOSE_FILE down
    ;;
  "reset")
    docker-compose -f $COMPOSE_FILE down -v --remove-orphans && $0 $1 start-new
    ;;
  "logs")
    docker-compose -f $COMPOSE_FILE logs $3
    ;;
  "ps")
    docker-compose -f $COMPOSE_FILE ps
    ;;
  "--help")
cat <<EOF
Usage: ${1,}.sh [start|stop|reset]

--help              Shows this help text.
start               Launches $SERVICE in background
stop                Stops $SERVICE execution
reset               Stops $SERVICE execution, delete its data and starts it again
EOF
;;
  *)
    echo "Error.";
    exit 1
    ;;
esac