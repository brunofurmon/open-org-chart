# open-org-chart

An open-source Org Chart made with [NextJS](https://nextjs.org/) and [d3-org-chart](https://www.npmjs.com/package/d3-org-chart)

## Installation

```sh
make setup
```

## Configuration

The application can be configured by setting environment variables. The default values are set on the `.env.default` file, and you should modify the `.env` file to override them.

| Variable                       | Description                                                                                                     | Default Value                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `CACHE_ENGINE`                 | Cache engine of choice. Can be 'memory' or 'redis'                                                              | `memory`                                       |
| `CSV_FILE_PATH`                | Path to the CSV file containing the users data. Only used when `USER_BACKEND_MODE` is set to `csv`              | `./csv_sample.csv`                             |
| `DEBUG`                        | All log lines that match this expression will be thrown in STDOUT (Console).                                    | `*`                                            |
| `GADMIN_AUTH_CLIENT_SUBJECT`   | An account with permissions to list users from the directory                                                    | `admin@domain.com`                             |
| `GADMIN_WORKSPACE_CUSTOMER_ID` | Your Google Workspace id ([how to get it](https://support.google.com/a/answer/10070793))                        | `A0123b4c5`                                    |
| `GADMIN_WORKSPACE_DOMAIN`      | The domain used to filter users from a directory                                                                | `domain.com`                                   |
| `GSHEETS_API_KEY`              | API key to access the Google Sheets API                                                                         | `no default`                                   |
| `GSHEETS_SPREADSHEET_ID`       | Id of the Google Sheets document                                                                                | `13epIQsN6DqmAktLCSeIzSYpNR5LzVEnvZ2cbo5-KgyY` |
| `LOG_LEVEL`                    | The log level of the application. Examples: `info`, `debug`, `error`, `warn`                                    | `info`                                         |
| `NODE_ENV`                     | The environment the application is running on. Examples: `development`, `production`                            | `development`                                  |
| `REDIS_URL`                    | Id `CACHE_ENGINE` is set to "redis" then the complete URL with protocol, host and port                          | `redis://redis:6379`                           |
| `ROOT_NODE_ID`                 | The id (email) of the root node                                                                                 | `email@domain.com`                             |
| `SERVER_PORT`                  | The port the application will be listening to.                                                                  | `3000`                                         |
| `TTL_CACHE_S`                  | Expiration time for users cache entry to be valid (when using memory, cache is perpetual until app termination) | `3600`                                         |
| `USER_BACKEND_MODE`            | User backend selection. Can be "csv", "googleadmin" or "googlesheets"                                           | `csv`                                          |

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

# Integrations Reference

You can select one of the following integrations to fetch users from:

## CSV

- Set `USER_BACKEND_MODE` to `csv`
- Use the `csv_sample.csv` file as a template to populate your org with data
- Set the `CSV_FILE` environment variable to the path of your CSV file if you wish to have a different path and/or name

## Google Admin

- Set `USER_BACKEND_MODE` to `googleadmin`
- Set the `GADMIN_WORKSPACE_CUSTOMER_ID` to your Google Workspace id ([how to get it](https://support.google.com/a/answer/10070793))
- Set the `GADMIN_WORKSPACE_DOMAIN` to the domain you want to filter users from
- Set the `GADMIN_AUTH_CLIENT_SUBJECT` to an account with permissions to list users from the directory (part of GSuite Admins)

## Google Sheets

- Set `USER_BACKEND_MODE` to `googlesheets`
- Copy this public spreadsheet -> https://docs.google.com/spreadsheets/d/13epIQsN6DqmAktLCSeIzSYpNR5LzVEnvZ2cbo5-KgyY/edit?gid=0#gid=0 and...
- ...set the `GSHEETS_SPREADSHEET_ID` to the id of the Google Sheets document (part of the URL, as in the example above between `/d/` and `/edit` (may change in the future))
- Set the `GSHEETS_API_KEY` to the API key to access the Google Sheets API

# Cache Engine

You can select one of the following cache engines to store users data:

## Memory

- Set `CACHE_ENGINE` to `memory`
- Set the `ADMIN_USERS_TTL_CACHE_S` to the expiration time for users cache entry to be valid (in seconds)

## Redis

- Set `CACHE_ENGINE` to `redis`
- Set the `REDIS_URL` to the complete URL with protocol, host and port

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
