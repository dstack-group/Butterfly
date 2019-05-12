buttercli
======

A CLI to interact with the Butterfly User Manager REST API

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g buttercli
$ buttercli COMMAND
running command...
$ buttercli (-v|--version|version)
buttercli/0.0.1 win32-x64 node-v10.15.3
$ buttercli --help [COMMAND]
USAGE
  $ buttercli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`buttercli config:list`](#buttercli-configlist)
* [`buttercli config:server`](#buttercli-configserver)
* [`buttercli config:user`](#buttercli-configuser)
* [`buttercli contact:create`](#buttercli-contactcreate)
* [`buttercli contact:find`](#buttercli-contactfind)
* [`buttercli contact:remove`](#buttercli-contactremove)
* [`buttercli contact:update`](#buttercli-contactupdate)
* [`buttercli help [COMMAND]`](#buttercli-help-command)
* [`buttercli init`](#buttercli-init)
* [`buttercli project:create`](#buttercli-projectcreate)
* [`buttercli project:find`](#buttercli-projectfind)
* [`buttercli project:list`](#buttercli-projectlist)
* [`buttercli project:remove`](#buttercli-projectremove)
* [`buttercli project:update`](#buttercli-projectupdate)
* [`buttercli sub:create`](#buttercli-subcreate)
* [`buttercli sub:find`](#buttercli-subfind)
* [`buttercli sub:remove`](#buttercli-subremove)
* [`buttercli sub:update`](#buttercli-subupdate)
* [`buttercli user:create`](#buttercli-usercreate)
* [`buttercli user:find`](#buttercli-userfind)
* [`buttercli user:list`](#buttercli-userlist)
* [`buttercli user:remove`](#buttercli-userremove)
* [`buttercli user:update`](#buttercli-userupdate)

## `buttercli config:list`

List all the configuration settings or only a subset of them

```
USAGE
  $ buttercli config:list

OPTIONS
  -h, --help      show CLI help
  -j, --json      display results in json format
  -s, --server    Get only the server settings
  -u, --user      Get only the user settings
  -x, --extended  show extra columns
```

_See code: [dist\commands\config\list.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\config\list.ts)_

## `buttercli config:server`

Set all the server settings or only a subset of them.

```
USAGE
  $ buttercli config:server

OPTIONS
  -h, --help               show CLI help
  -j, --json               display results in json format
  -n, --hostname=hostname  (required) Set the hostname of the user-manager server
  -p, --port=port          (required) Set the port of the user-manager server
  -t, --timeout=timeout    Set a timeout for the server connection
  -x, --extended           show extra columns

DESCRIPTION
  Remember that every time that config:server is invoked all the old server settings will be overwritten
```

_See code: [dist\commands\config\server.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\config\server.ts)_

## `buttercli config:user`

Set all the user informations or only a subset of them.

```
USAGE
  $ buttercli config:user

OPTIONS
  -e, --email=email          Set a default email
  -f, --firstname=firstname  Set your firstname
  -h, --help                 show CLI help
  -j, --json                 display results in json format
  -l, --lastname=lastname    Set your lastname
  -x, --extended             show extra columns

DESCRIPTION
  Remember that every time that config:user is invoked all the old user informations will be overwritten
```

_See code: [dist\commands\config\user.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\config\user.ts)_

## `buttercli contact:create`

Create a new user contact

```
USAGE
  $ buttercli contact:create

OPTIONS
  -c, --emailc=emailc      email where notifications are sent
  -e, --email=email        (required) user email address
  -h, --help               show CLI help
  -j, --json               display results in json format
  -s, --slack=slack        slack account
  -t, --telegram=telegram  telegram account
  -x, --extended           show extra columns
```

_See code: [dist\commands\contact\create.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\contact\create.ts)_

## `buttercli contact:find`

Find all contacts of a specific user identified by email

```
USAGE
  $ buttercli contact:find

OPTIONS
  -e, --email=email  (required) user email address
  -h, --help         show CLI help
  -j, --json         display results in json format
  -x, --extended     show extra columns
```

_See code: [dist\commands\contact\find.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\contact\find.ts)_

## `buttercli contact:remove`

Remove an existing user contact specified by user email and contact service

```
USAGE
  $ buttercli contact:remove

OPTIONS
  -e, --email=email  (required) user email address
  -h, --help         show CLI help
  -j, --json         display results in json format
  -m, --emailc       remove email account
  -s, --slack        slack account
  -t, --telegram     telegram account
  -x, --extended     show extra columns
```

_See code: [dist\commands\contact\remove.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\contact\remove.ts)_

## `buttercli contact:update`

Update an existing user contact account specified by user email and contact service

```
USAGE
  $ buttercli contact:update

OPTIONS
  -e, --email=email        (required) user email address
  -h, --help               show CLI help
  -j, --json               display results in json format
  -m, --emailc=emailc      email where notifications are sent
  -s, --slack=slack        slack account
  -t, --telegram=telegram  telegram account
  -x, --extended           show extra columns
```

_See code: [dist\commands\contact\update.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\contact\update.ts)_

## `buttercli help [COMMAND]`

display help for buttercli

```
USAGE
  $ buttercli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src\commands\help.ts)_

## `buttercli init`

Initialize the db and set all the server settings

```
USAGE
  $ buttercli init
```

_See code: [dist\commands\init.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\init.ts)_

## `buttercli project:create`

Create a new project specifing one or more service urls

```
USAGE
  $ buttercli project:create

OPTIONS
  -g, --gitlab=gitlab        gitlab url of the new project
  -h, --help                 show CLI help
  -j, --json                 display results in json format
  -n, --name=name            (required) project name (max 50 characters)
  -r, --redmine=redmine      redmine url of the new project
  -s, --sonarqube=sonarqube  sonarqube url of the new project
  -x, --extended             show extra columns
```

_See code: [dist\commands\project\create.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\project\create.ts)_

## `buttercli project:find`

Find a specific project identified by name

```
USAGE
  $ buttercli project:find

OPTIONS
  -h, --help       show CLI help
  -j, --json       display results in json format
  -n, --name=name  (required) project name (max 50 characters)
  -x, --extended   show extra columns
```

_See code: [dist\commands\project\find.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\project\find.ts)_

## `buttercli project:list`

Show a list of all projects

```
USAGE
  $ buttercli project:list

OPTIONS
  -h, --help      show CLI help
  -j, --json      display results in json format
  -x, --extended  show extra columns
```

_See code: [dist\commands\project\list.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\project\list.ts)_

## `buttercli project:remove`

Remove an existing project or only the service urls specified

```
USAGE
  $ buttercli project:remove

OPTIONS
  -g, --gitlab     remove project gitlab url
  -h, --help       show CLI help
  -j, --json       display results in json format
  -n, --name=name  (required) project name (max 50 characters)
  -r, --redmine    remove project redmine url
  -s, --sonarqube  remove project sonarqube
  -x, --extended   show extra columns
```

_See code: [dist\commands\project\remove.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\project\remove.ts)_

## `buttercli project:update`

Update an existing service url of the project identified by name

```
USAGE
  $ buttercli project:update

OPTIONS
  -g, --gitlab=gitlab        new gitlab url of the project
  -h, --help                 show CLI help
  -j, --json                 display results in json format
  -n, --name=name            (required) project name (max 50 characters)
  -r, --redmine=redmine      new redmine url of the project
  -s, --sonarqube=sonarqube  new sonarqube url of the project
  -x, --extended             show extra columns
```

_See code: [dist\commands\project\update.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\project\update.ts)_

## `buttercli sub:create`

Create a new subscription

```
USAGE
  $ buttercli sub:create

OPTIONS
  -H, --highPriority                      set priority to high
  -L, --lowPriority                       set priority to low
  -M, --mediumPriority                    set priority to medium
  -c, --emailc                            send notifications via email
  -e, --email=email                       (required) user email address
  -h, --help                              show CLI help
  -j, --json                              display results in json format
  -k, --keyword=keyword                   (required) keyword compared with the contents of the future events
  -p, --projectName=projectName           (required) project name
  -s, --slack                             send notifications via slack
  -t, --telegram                          send notifications via telegram
  -x, --extended                          show extra columns
  --gitlab_commit_created                 set event: GITLAB_COMMIT_CREATED
  --gitlab_issue_created                  set event: GITLAB_ISSUE_CREATED
  --gitlab_issue_edited                   set event: GITLAB_ISSUE_EDITED
  --gitlab_merge_request_closed           set event: GITLAB_MERGE_REQUEST_CLOSED
  --gitlab_merge_request_created          set event: GITLAB_MERGE_REQUEST_CREATED
  --gitlab_merge_request_edited           set event: GITLAB_MERGE_REQUEST_EDITED
  --gitlab_merge_request_merged           set event: GITLAB_MERGE_REQUEST_MERGED
  --redmine_ticket_created                set event: REDMINE_TICKET_CREATED
  --redmine_ticket_edited                 set event: REDMINE_TICKET_EDITED
  --sonarqube_project_analysis_completed  set event: SONARQUBE_PROJECT_ANALYSIS_COMPLETED
```

_See code: [dist\commands\sub\create.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\sub\create.ts)_

## `buttercli sub:find`

Find an existing subscription

```
USAGE
  $ buttercli sub:find

OPTIONS
  -e, --email=email                       (required) user email address
  -h, --help                              show CLI help
  -j, --json                              display results in json format
  -p, --projectName=projectName           (required) project name
  -x, --extended                          show extra columns
  --gitlab_commit_created                 set event: GITLAB_COMMIT_CREATED
  --gitlab_issue_created                  set event: GITLAB_ISSUE_CREATED
  --gitlab_issue_edited                   set event: GITLAB_ISSUE_EDITED
  --gitlab_merge_request_closed           set event: GITLAB_MERGE_REQUEST_CLOSED
  --gitlab_merge_request_created          set event: GITLAB_MERGE_REQUEST_CREATED
  --gitlab_merge_request_edited           set event: GITLAB_MERGE_REQUEST_EDITED
  --gitlab_merge_request_merged           set event: GITLAB_MERGE_REQUEST_MERGED
  --redmine_ticket_created                set event: REDMINE_TICKET_CREATED
  --redmine_ticket_edited                 set event: REDMINE_TICKET_EDITED
  --sonarqube_project_analysis_completed  set event: SONARQUBE_PROJECT_ANALYSIS_COMPLETED
```

_See code: [dist\commands\sub\find.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\sub\find.ts)_

## `buttercli sub:remove`

Remove an existing subscription

```
USAGE
  $ buttercli sub:remove

OPTIONS
  -e, --email=email                       (required) user email address
  -h, --help                              show CLI help
  -j, --json                              display results in json format
  -p, --projectName=projectName           (required) project name
  -x, --extended                          show extra columns
  --gitlab_commit_created                 set event: GITLAB_COMMIT_CREATED
  --gitlab_issue_created                  set event: GITLAB_ISSUE_CREATED
  --gitlab_issue_edited                   set event: GITLAB_ISSUE_EDITED
  --gitlab_merge_request_closed           set event: GITLAB_MERGE_REQUEST_CLOSED
  --gitlab_merge_request_created          set event: GITLAB_MERGE_REQUEST_CREATED
  --gitlab_merge_request_edited           set event: GITLAB_MERGE_REQUEST_EDITED
  --gitlab_merge_request_merged           set event: GITLAB_MERGE_REQUEST_MERGED
  --redmine_ticket_created                set event: REDMINE_TICKET_CREATED
  --redmine_ticket_edited                 set event: REDMINE_TICKET_EDITED
  --sonarqube_project_analysis_completed  set event: SONARQUBE_PROJECT_ANALYSIS_COMPLETED
```

_See code: [dist\commands\sub\remove.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\sub\remove.ts)_

## `buttercli sub:update`

Update an existing subscription

```
USAGE
  $ buttercli sub:update

OPTIONS
  -H, --highPriority                      set priority to high
  -L, --lowPriority                       set priority to low
  -M, --mediumPriority                    set priority to medium
  -c, --emailc                            send notifications via email
  -e, --email=email                       (required) user email address
  -h, --help                              show CLI help
  -j, --json                              display results in json format
  -k, --keyword=keyword                   keyword compared with the contents of the future events
  -p, --projectName=projectName           (required) project name
  -s, --slack                             send notifications via slack
  -t, --telegram                          send notifications via telegram
  -x, --extended                          show extra columns
  --gitlab_commit_created                 set event: GITLAB_COMMIT_CREATED
  --gitlab_issue_created                  set event: GITLAB_ISSUE_CREATED
  --gitlab_issue_edited                   set event: GITLAB_ISSUE_EDITED
  --gitlab_merge_request_closed           set event: GITLAB_MERGE_REQUEST_CLOSED
  --gitlab_merge_request_created          set event: GITLAB_MERGE_REQUEST_CREATED
  --gitlab_merge_request_edited           set event: GITLAB_MERGE_REQUEST_EDITED
  --gitlab_merge_request_merged           set event: GITLAB_MERGE_REQUEST_MERGED
  --redmine_ticket_created                set event: REDMINE_TICKET_CREATED
  --redmine_ticket_edited                 set event: REDMINE_TICKET_EDITED
  --sonarqube_project_analysis_completed  set event: SONARQUBE_PROJECT_ANALYSIS_COMPLETED
```

_See code: [dist\commands\sub\update.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\sub\update.ts)_

## `buttercli user:create`

Create a new user

```
USAGE
  $ buttercli user:create

OPTIONS
  -a, --[no-]available       the new user is currently available (default is true)
  -e, --email=email          (required) new user email address
  -f, --firstname=firstname  (required) new user first name (max 30 characters)
  -h, --help                 show CLI help
  -j, --json                 display results in json format
  -l, --lastname=lastname    (required) new user last name (max 30 characters)
  -x, --extended             show extra columns
```

_See code: [dist\commands\user\create.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\user\create.ts)_

## `buttercli user:find`

Find all users or a specific user identified by email

```
USAGE
  $ buttercli user:find

OPTIONS
  -e, --email=email  (required) user email address
  -h, --help         show CLI help
  -j, --json         display results in json format
  -x, --extended     show extra columns
```

_See code: [dist\commands\user\find.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\user\find.ts)_

## `buttercli user:list`

Show a list of all users

```
USAGE
  $ buttercli user:list

OPTIONS
  -h, --help      show CLI help
  -j, --json      display results in json format
  -x, --extended  show extra columns
```

_See code: [dist\commands\user\list.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\user\list.ts)_

## `buttercli user:remove`

Remove a specific user identified by email

```
USAGE
  $ buttercli user:remove

OPTIONS
  -e, --email=email  (required) user email address
  -h, --help         show CLI help
  -j, --json         display results in json format
  -x, --extended     show extra columns
```

_See code: [dist\commands\user\remove.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\user\remove.ts)_

## `buttercli user:update`

Update an existing user identified by email

```
USAGE
  $ buttercli user:update

OPTIONS
  -a, --[no-]available       the user is currently available (default is true)
  -e, --email=email          (required) user email address
  -f, --firstname=firstname  new first name (max 30 characters)
  -h, --help                 show CLI help
  -j, --json                 display results in json format
  -l, --lastname=lastname    new last name (max 30 characters)
  -x, --extended             show extra columns
```

_See code: [dist\commands\user\update.ts](https://github.com/dstack-group/Butterfly/blob/v0.0.1/dist\commands\user\update.ts)_
<!-- commandsstop -->
