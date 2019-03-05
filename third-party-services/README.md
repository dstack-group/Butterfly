# Redmine

## How to run

- Start: `./redmine.sh start`
- Stop: `./redmine.sh stop`
- Reset: `./redmine.sh reset`
- Logs: `./redmine.sh logs`

After some seconds, open [http://localhost:15000](http://localhost:15000) and insert the following credentials:

- username: **admin**
- password: **admin**

## redmine-webhook-response-inspector

This is a useful tool to inspect Redmine responses. Add a webhook to a Redmine project, pointing to `http://redmine-webhook-response-inspector:5000/webhook/redmine` as webhook URL. This tool is launched by `./redmine.sh start`.

# Gitlab

## How to run

- Start: `./gitlab.sh start`
- Stop: `./gitlab.sh stop`
- Reset: `./gitlab.sh reset`
- Logs: `./gitlab.sh logs`

After some seconds, open [http://localhost:15001](http://localhost:15001) and insert the following credentials:

- username: **butterfly**
- password: **butterfly**

# Sonarqube

## How to run

- Start: `./sonarqube.sh start`
- Stop: `./sonarqube.sh stop`
- Reset: `./sonarqube.sh reset`
- Logs: `./sonarqube.sh logs`

After some seconds, open [http://localhost:15002](http://localhost:15002) and insert the following credentials:

- username: **admin**
- password: **admin**
