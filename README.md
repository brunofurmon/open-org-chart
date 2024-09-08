# open-org-chart

An open-source Org Chart made with [NextJS](https://nextjs.org/) and [d3-org-chart](https://www.npmjs.com/package/d3-org-chart)

## Installation

```sh
make setup
```

## Configuration

The application can be configured by setting environment variables. The default values are set on the `.env.default` file, and you should modify the `.env` file to override them.

| Variable                  | Description                                                                                                     | Default Value        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------- |
| `NODE_ENV`                | The environment the application is running on. Examples: `development`, `production`                            | `development`        |
| `SERVER_PORT`             | The port the application will be listening to.                                                                  | `3000`               |
| `LOG_LEVEL`               | The log level of the application. Examples: `info`, `debug`, `error`, `warn`                                    | `info`               |
| `DEBUG`                   | All log lines that match this expression will be thrown in STDOUT (Console).                                    | `*`                  |
| `ROOT_NODE_ID`            | The id (email) of the root node                                                                                 | `email@domain.com`   |
| `WORKSPACE_CUSTOMER_ID`   | Your Google Workspace id ([how to get it](https://support.google.com/a/answer/10070793))                        | `A0123b4c5`          |
| `WORKSPACE_DOMAIN`        | The domain used to filter users from a directory                                                                | `domain.com`         |
| `AUTH_CLIENT_SUBJECT`     | An account with permissions to list users from the directory                                                    | `admin@domain.com`   |
| `CACHE_ENGINE`            | Cache engine of choice. Can be 'memory' or 'redis'                                                              | `memory`             |
| `REDIS_URL`               | Id `CACHE_ENGINE` is set to "redis" then the complete URL with protocol, host and port                          | `redis://redis:6379` |
| `ADMIN_USERS_TTL_CACHE_S` | Expiration time for users cache entry to be valid (when using memory, cache is perpetual until app termination) | `3600`               |
| `USER_BACKEND_MODE`       | User backend selection. Can be "csv" or "googleadmin"                                                           | `csv`                |

## Running

### Development:

First of all, install dependencies through your favorite package mananger (yarn is the default)

```sh
yarn
```

The command above will run a server on port 3000 and map port 9229 for debug attaching

```sh
yarn dev
```

This repo comes with [vscode launch file](.vscode/launch.json). Chose a debugging profile and hit F5 to start inspect server or attach through browser.

### Production:

The present Dockerfile will generate a production optimized build and serve it through 0.0.0.0:3000 for
the use to be able to reach it through the host machine against the application container.

```sh
make setup
```

And run with

```sh
make start
```

## API reference

### GET /[?debug=false]

Renders the organogram page

- _debug_ (default=false): If true, will render an intermediate node containing every account that has no original parent (manager) in the directory

### GET /api/liveness

Returns a liveness check if the application is running.

### GET /api/readiness

Returns a readiness check if cache is running and app is ready to deliver content.

## Improvements (TODO):

- Enable security enforcement
- Loading indication
- Better Layout and module separation
