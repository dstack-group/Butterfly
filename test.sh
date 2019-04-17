#/bin/bash

set -e;
echo "Building and testing Java modules";
(cd ./butterfly; ./build.sh --install --test);
echo "Building and testing User Manager module";
(cd ./user-manager; ./test.sh);
