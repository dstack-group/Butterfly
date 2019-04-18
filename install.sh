#/bin/bash

set -e;

# Install Butterfly Java services dependencies
cd ./butterfly;
./install.sh;
cd ..;

# Install user manager dependencies
cd ./user-manager;
docker-compose -f docker-compose.install.yml down -v;
docker-compose -f docker-compose.install.yml up --build;
