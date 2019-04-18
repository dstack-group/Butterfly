#/bin/bash

set -e;
echo "Building and testing Java modules";
cd ./butterfly; ./build.sh --clean --install --test; cd ..;
echo "Building and testing User Manager module";
cd ./user-manager; ./test.sh; cd ..;
