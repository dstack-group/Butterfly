# Setup Sonarqube scan [TODO: fix]

```sh
project=Butterfly
sonarqube_url=http://localhost:4718
token=35b71c9129baa771433c4607cc727b176ee465ed # it's retrieved from Sonarqube access panel

mvn clean install sonar:sonar \
  -Dsonar.projectKey=$project \
  -Dsonar.host.url=$sonarqube_url \
  -Dsonar.login=$token
```