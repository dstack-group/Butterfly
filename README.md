# Requirements

Here's a list of tools you should have installed on your PC:

- docker 18.09.*
- docker-compose 1.24.*

# Conventions

- Each declared command is meant to be run from the current directory

# TL/DR How to run everything

You'll need multiple terminals open.
How to run the entire system:

> Bash terminal 1: compiles the Java modules into executable jars with embedded dependencies in a Docker process.
- $ `cd butterfly`
- $ `./build.sh`

> Bash terminal 2: launches the Java services and creates docker-compose's virtual networks.
- $ `docker-compose up --build`

> Bash terminal 2: launches a new Gitlab instance (may require some minutes).
- $ `cd third-party-services`
- $ `./gitlab.sh start`

> Bash terminal 3: launches the User Manager subsystem (both the Postgres database with its initial data and the NodeJS REST APIs, which are transpiled from TypeScript to JavaScript in a Docker process)
- $ `cd user-manager`
- $ `docker-compose up --build`

-------------------------------------------------------------------------------------------

# How to run Kafka and the Java Producers

**This requires that you build the Java projects first.**

$ `cd butterfly`
$ `./build.sh`

<details>
  <summary>The `build` script should return a log similar to the following:</summary>

<code>
$ ./build.sh
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO]
[INFO] butterfly
         [pom]
[INFO] config
         [jar]
[INFO] producer
         [jar]
[INFO] consumer
         [jar]
[INFO] gitlab-producer
         [jar]
[INFO] redmine-producer
         [jar]
[INFO] sonarqube-producer
         [jar]
[INFO]
[INFO] ----------------< it.unipd.dstack.butterfly:butterfly >-----------------
[INFO] Building butterfly 1.0-SNAPSHOT
         [1/7]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ butterfly ---
[INFO]
[INFO] --------------< it.unipd.dstack.butterfly.config:config >---------------
[INFO] Building config 1.0-SNAPSHOT
         [2/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ config ---
[INFO]
[INFO] ------------< it.unipd.dstack.butterfly.producer:producer
>-------------
[INFO] Building producer 1.0-SNAPSHOT
         [3/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ producer ---
[INFO]
[INFO] ------------< it.unipd.dstack.butterfly.consumer:consumer
>-------------
[INFO] Building consumer 1.0-SNAPSHOT
         [4/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ consumer ---
[INFO]
[INFO] --< it.unipd.dstack.butterfly.producer.gitlab-producer:gitlab-producer >--
[INFO] Building gitlab-producer 1.0-SNAPSHOT
         [5/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ gitlab-producer ---
[INFO]
[INFO] --< it.unipd.dstack.butterfly.producer.redmine-producer:redmine-producer >--
[INFO] Building redmine-producer 1.0-SNAPSHOT
         [6/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ redmine-producer ---
[INFO]
[INFO] --< it.unipd.dstack.butterfly.producer.sonarqube-producer:sonarqube-producer >--
[INFO] Building sonarqube-producer 1.0-SNAPSHOT
         [7/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] consumer ........................................... SUCCESS [  0.005 s]
[INFO] gitlab-producer .................................... SUCCESS [  0.008 s]
[INFO] redmine-producer ................................... SUCCESS [  0.008 s]
[INFO] sonarqube-producer ................................. SUCCESS [  0.008 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.696 s
[INFO] Finished at: 2019-02-23T08:33:28Z
[INFO] ------------------------------------------------------------------------
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO]
[INFO] butterfly
         [pom]
[INFO] config
         [jar]
[INFO] producer
         [jar]
[INFO] consumer
         [jar]
[INFO] gitlab-producer
         [jar]
[INFO] redmine-producer
         [jar]
[INFO] sonarqube-producer
         [jar]
[INFO]
[INFO] ----------------< it.unipd.dstack.butterfly:butterfly >-----------------
[INFO] Building butterfly 1.0-SNAPSHOT
         [1/7]
[INFO] --------------------------------[ pom ]---------------------------------
[INFO]
[INFO] --------------< it.unipd.dstack.butterfly.config:config >---------------
[INFO] Building config 1.0-SNAPSHOT
         [2/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ config ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/config/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ config ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 2 source files to /butterfly/config/target/classes
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ config ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/config/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ config ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ config ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ config ---
[INFO] Building jar: /butterfly/config/target/config-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ config ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/config/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ config ---
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ config ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/config/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ config ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ config ---
[INFO] No tests to run.
[INFO] Skipping execution of surefire because it has already been run for this configuration
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ config ---
[INFO]
[INFO] ------------< it.unipd.dstack.butterfly.producer:producer
>-------------
[INFO] Building producer 1.0-SNAPSHOT
         [3/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- avro-maven-plugin:1.8.2:schema (default) @ producer ---
[INFO]
[INFO] --- avro-maven-plugin:1.8.2:protocol (default) @ producer
---
[INFO]
[INFO] --- avro-maven-plugin:1.8.2:idl-protocol (default) @ producer ---
[INFO]
[INFO] --- build-helper-maven-plugin:3.0.0:add-source (add-source) @ producer ---
[INFO] Source directory: /butterfly/producer/target/generated-sources/avro added.
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ producer ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 5 source files to /butterfly/producer/target/classes
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ producer ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ producer ---
[INFO] Building jar: /butterfly/producer/target/producer-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- avro-maven-plugin:1.8.2:schema (default) @ producer ---
[INFO]
[INFO] --- avro-maven-plugin:1.8.2:protocol (default) @ producer
---
[INFO]
[INFO] --- avro-maven-plugin:1.8.2:idl-protocol (default) @ producer ---
[INFO]
[INFO] --- build-helper-maven-plugin:3.0.0:add-source (add-source) @ producer ---
[INFO] Source directory: /butterfly/producer/target/generated-sources/avro added.
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ producer ---
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ producer ---
[INFO] No tests to run.
[INFO] Skipping execution of surefire because it has already been run for this configuration
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ producer ---
[INFO]
[INFO] ------------< it.unipd.dstack.butterfly.consumer:consumer
>-------------
[INFO] Building consumer 1.0-SNAPSHOT
         [4/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ consumer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/consumer/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ consumer ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 1 source file to /butterfly/consumer/target/classes
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ consumer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/consumer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ consumer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ consumer ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ consumer ---
[INFO] Building jar: /butterfly/consumer/target/consumer-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ consumer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/consumer/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ consumer ---
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ consumer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/consumer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ consumer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ consumer ---
[INFO] No tests to run.
[INFO] Skipping execution of surefire because it has already been run for this configuration
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ consumer ---
[INFO]
[INFO] --< it.unipd.dstack.butterfly.producer.gitlab-producer:gitlab-producer >--
[INFO] Building gitlab-producer 1.0-SNAPSHOT
         [5/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ gitlab-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ gitlab-producer ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 6 source files to /butterfly/gitlab-producer/target/classes
[INFO] /butterfly/gitlab-producer/src/main/java/it/unipd/dstack/butterfly/producer/gitlab/GitlabProducerController.java: /butterfly/gitlab-producer/src/main/java/it/unipd/dstack/butterfly/producer/gitlab/GitlabProducerController.java uses unchecked or unsafe operations.
[INFO] /butterfly/gitlab-producer/src/main/java/it/unipd/dstack/butterfly/producer/gitlab/GitlabProducerController.java: Recompile with -Xlint:unchecked for details.
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ gitlab-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/gitlab-producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ gitlab-producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ gitlab-producer ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ gitlab-producer ---
[INFO] Building jar: /butterfly/gitlab-producer/target/gitlab-producer-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- maven-assembly-plugin:3.1.1:single (make-assembly) @ gitlab-producer ---
Downloading from confluent: http://packages.confluent.io/maven/joda-time/joda-time/maven-metadata.xml
[INFO] Building jar: /butterfly/gitlab-producer/target/gitlab-producer-1.0-SNAPSHOT-jar-with-dependencies.jar
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ gitlab-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ gitlab-producer ---
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ gitlab-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/gitlab-producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ gitlab-producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ gitlab-producer ---
[INFO] No tests to run.
[INFO] Skipping execution of surefire because it has already been run for this configuration
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ gitlab-producer ---
[INFO]
[INFO] --- maven-assembly-plugin:3.1.1:single (make-assembly) @ gitlab-producer ---
[INFO] Building jar: /butterfly/gitlab-producer/target/gitlab-producer-1.0-SNAPSHOT-jar-with-dependencies.jar
[INFO]
[INFO] --< it.unipd.dstack.butterfly.producer.redmine-producer:redmine-producer >--
[INFO] Building redmine-producer 1.0-SNAPSHOT
         [6/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ redmine-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/redmine-producer/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ redmine-producer ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 1 source file to /butterfly/redmine-producer/target/classes
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ redmine-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/redmine-producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ redmine-producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ redmine-producer ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ redmine-producer ---
[INFO] Building jar: /butterfly/redmine-producer/target/redmine-producer-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ redmine-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/redmine-producer/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ redmine-producer ---
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ redmine-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/redmine-producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ redmine-producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ redmine-producer ---
[INFO] No tests to run.
[INFO] Skipping execution of surefire because it has already been run for this configuration
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ redmine-producer ---
[INFO]
[INFO] --< it.unipd.dstack.butterfly.producer.sonarqube-producer:sonarqube-producer >--
[INFO] Building sonarqube-producer 1.0-SNAPSHOT
         [7/7]
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ sonarqube-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/sonarqube-producer/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ sonarqube-producer ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 1 source file to /butterfly/sonarqube-producer/target/classes
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ sonarqube-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/sonarqube-producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ sonarqube-producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ sonarqube-producer ---
[INFO] No tests to run.
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ sonarqube-producer ---
[INFO] Building jar: /butterfly/sonarqube-producer/target/sonarqube-producer-1.0-SNAPSHOT.jar
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:resources (default-resources) @ sonarqube-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/sonarqube-producer/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:compile (default-compile)
@ sonarqube-producer ---
[INFO] Nothing to compile - all classes are up to date
[INFO]
[INFO] --- maven-resources-plugin:3.0.2:testResources (default-testResources) @ sonarqube-producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /butterfly/sonarqube-producer/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.8.0:testCompile (default-testCompile) @ sonarqube-producer ---
[INFO] No sources to compile
[INFO]
[INFO] --- maven-surefire-plugin:2.22.1:test (default-test) @ sonarqube-producer ---
[INFO] No tests to run.
[INFO] Skipping execution of surefire because it has already been run for this configuration
[INFO]
[INFO] --- maven-jar-plugin:3.0.2:jar (default-jar) @ sonarqube-producer ---
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary for butterfly 1.0-SNAPSHOT:
[INFO]
[INFO] butterfly .......................................... SUCCESS [  0.008 s]
[INFO] config ............................................. SUCCESS [  4.844 s]
[INFO] producer ........................................... SUCCESS [  2.828 s]
[INFO] consumer ........................................... SUCCESS [  0.485 s]
[INFO] gitlab-producer .................................... SUCCESS [ 20.822 s]
[INFO] redmine-producer ................................... SUCCESS [  0.685 s]
[INFO] sonarqube-producer ................................. SUCCESS [  0.403 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  30.273 s
[INFO] Finished at: 2019-02-23T08:36:19Z
[INFO] ------------------------------------------------------------------------
</code>
</details>

---

You can that turn back to the root directory (`cd ..`) and run the suite running:

$ `docker-compose up --build`

This may require some seconds.
You can check the status of the services by running:

$ `docker-compose ps`

## Kafka

Right now there's a single Kafka node, which is accessible by another Docker service on port `9092`, and by the host machine on port `29092`.

## Zookeeper

Right now there's a single Zookeeper node, which runs on port `2181` for both Docker services and the host machine.

## Kafka Schema Registry

Right now there's a single Kafka Schema Registry, which runs on port `8081` for both Docker services and the host machine.

## Gitlab Producer

Right now it's the only alpha-ready Producer app available.
It exposes the TCP port `3000` and accepts Gitlab Webhooks at `HTTP POST localhost:3000/webhooks/gitlab`.
It reads its configuration at boot time from its environment variables, which are defined in [./butterfly/gitlab-producer/.gitlab-producer.env](./tree/master/butterfly/gitlab-producer/.gitlab-producer.env).

## Middleware Dispatcher

It reads messages from `service-gitlab`, `service-sonarqube`, `service-redmine`, asks the `user-manager` for a list of users that should
receive the event described by these messages, and publishes a new message for each contact that each user in the list has defined.
It can write to `contact-telegram`, `contact-slack`, and `contact-email` topics.
It reads its configuration at boot time from its environment variables, which are defined in [./butterfly/middleware-dispatcher/.middleware-dispatcher.env](./tree/master/butterfly/middleware-dispatcher/.middleware-dispatcher.env).

## Telegram Consumer

Consumer that reads messages from the `contact-telegram` topic.
It reads its configuration at boot time from its environment variables, which are defined in [./butterfly/telegram-consumer/.telegram-consumer.env](./tree/master/butterfly/telegram-consumer/.telegram-consumer.env).

## Email Consumer

Consumer that reads messages from the `contact-email` topic.
It reads its configuration at boot time from its environment variables, which are defined in [./butterfly/email-consumer/.email-consumer.env](./tree/master/butterfly/email-consumer/.email-consumer.env).

# How to run third party services

$ `cd third/party/services`

## Redmine

### Available commands

- Start: `./redmine.sh start`
- Stop: `./redmine.sh stop`
- Reset: `./redmine.sh reset`
- Logs: `./redmine.sh logs`

After some seconds, open [http://localhost:15000](http://localhost:15000) and insert the following credentials:

- username: **admin**
- password: **admin**

### redmine-webhook-response-inspector

This is a useful tool to inspect Redmine responses. Add a webhook to a Redmine project, pointing to `http://redmine-webhook-response-inspector:5000/webhook/redmine` as webhook URL. This tool is launched by `./redmine.sh start`.

## Gitlab

### Available commands

- Start: `./gitlab.sh start`
- Stop: `./gitlab.sh stop`
- Reset: `./gitlab.sh reset`
- Logs: `./gitlab.sh logs`

After some seconds, open [https://localhost:10443](http://localhost:10443) and insert the following credentials:

- username: **butterfly**
- password: **butterfly**

## Sonarqube

### Available commands

- Start: `./sonarqube.sh start`
- Stop: `./sonarqube.sh stop`
- Reset: `./sonarqube.sh reset`
- Logs: `./sonarqube.sh logs`

After some seconds, open [http://localhost:15002](http://localhost:15002) and insert the following credentials:

- username: **admin**
- password: **admin**

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

