# Butterfly

<div align="center">
  <!-- Build Status -->
  <a href="https://travis-ci.org/dstack-group/Butterfly">
    <img src="https://travis-ci.org/dstack-group/Butterfly.svg?branch=master" alt="Build Status" />
  </a>
</div>

<div align="center">
  <sub>Created by <a href="https://github.com/dstack-group/">DStack Group</a> with ❤️.</sub>
</div>

Butterfly is a set of microservices that communicate via Apache Kafka and REST APIs which aims to simplify
how different project notifications are handled.
This project has been developed by the DStack team during the Software Engineering course of the University of Padova.

-------------------------------------------------------------------------------------------

# Table of Contents

- [Requirements](#requirements)
- [Test everything](#test-everything)
- [Run everything](#run-everything)
- [Dev Scripts](#dev-scripts)
- [Exposed services](#exposed-services)
- [Modules](#modules)
- [Wiki Links](#wiki-links)
- [Create Issues](#create-issues)
- [FAQ](#faq)
- [Team](#team)
- [License](#license)

# Requirements

Here's a list of tools you should have installed on your PC:

- docker 18.09.*
- docker-compose 1.24.*

# Test everything

`./run.sh --build test`

# Run everything

`./run.sh prod`

# Dev Scripts

```text
Usage:
./run.sh [OPTIONS] COMMAND

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
```

# Exposed services

| Service                    | Port   | Root Endpoint         |
| -------------------------- | ------ | --------------------- |
| gitlab-producer            | `3000` | `/webhooks/gitlab`    |
| redmine-producer           | `4000` | `/webhooks/redmine`   |
| sonarqube-producer         | `6000` | `/webhooks/sonarqube` |
| user-manager-rest-api      | `5000` | `/`                   |
| slack-account-configurator | `5200` | `/slack/events`       |
| pgadmin                    | `8080` | `/`                   |
| openapi                    | `8082` | `/`                   |

# Modules

- [gitlab-producer](./butterfly/gitlab-producer)
- [redmine-producer](./butterfly/redmine-producer)
- [sonarqube-producer](./butterfly/sonarqube-producer)
- [middleware-dispatcher](./butterfly/middleware-dispatcher)
- [email-consumer](./butterfly/email-consumer)
- [telegram-consumer](./butterfly/telegram-consumer)
- [slack-consumer](./butterfly/slack-consumer)
- [slack-account-configurator](./user-manager/slack-account-configurator)
- [user-manager-rest-api](./user-manager/user-manager-rest-api)
- [user-manager-database](./user-manager/user-manager-database)
- [buttercli](./user-manager/buttercli)

# Wiki Links

Here are some in-depth documentation about Butterfly's internals (written in Italian):

- [Message Structures](https://github.com/dstack-group/Butterfly/wiki/Struttura-Messaggi-Interni)
- [User Manager](https://github.com/dstack-group/Butterfly/wiki/Backend-Gestore-Personale)

# Create Issues

This repository supports 3 types of issues:

- [**Bug report**](https://github.com/dstack-group/Butterfly/issues/new?assignees=&labels=&template=bug_report.md&title=): Create a report to help us improve and correct a bug in the code;
- [**Documentation error report**](https://github.com/dstack-group/Butterfly/issues/new?assignees=&labels=&template=documentation-error-report.md&title=): Create a report to help us improve and correct an error in documents;
- [**Feature request**](https://github.com/dstack-group/Butterfly/issues/new?assignees=&labels=&template=feature_request.md&title=): Suggest an idea for this project.

# FAQ

1) **Q** How to solve the error "driver failed programming external connectivity on endpoint"?

<details>
  <summary>Example error</summary>
<code>
ERROR: for zookeeper  Cannot start service zookeeper: driver failed programming external connectivity on endpoint zookeeper (c6225dbb06a1d8b2109f5156bd145e2e61d49278e1a3216d44a515f60f1a7b70): Error starting userland proxy: mkdir /port/tcp:0.0.0.0:2181:tcp:172.31.0.2:2181: input/output error

ERROR: for zookeeper  Cannot start service zookeeper: driver failed programming external connectivity on endpoint zookeeper (c6225dbb06a1d8b2109f5156bd145e2e61d49278e1a3216d44a515f60f1a7b70): Error starting userland proxy: mkdir /port/tcp:0.0.0.0:2181:tcp:172.31.0.2:2181: input/output error
ERROR: Encountered errors while bringing up the project.
</code>
</details>

  - **A**: just restart Docker, it's a known issue, especially on Windows

# Team

DStack is:

- [Alberto Schiabel](https://github.com/jkomyno)
- [Elton Stafa](https://github.com/eltonst)
- [Eleonora Signor](https://github.com/eleonorasignor)
- [Enrico Trinco](https://github.com/Dogemist)
- [Federico Rispo](https://github.com/federicorispo)
- [Harwinder Singh](https://github.com/singh-sardar)
- [Niccolò Vettorello](https://github.com/niccolovettorello)

# License

This project is [MIT](License.txt) licensed.
