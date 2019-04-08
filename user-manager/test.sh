docker-compose -f docker-compose.test.yml down -v;
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit;
