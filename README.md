# Ny i Trondheim

![node](https://badgen.net/badge/node/16/green/) [![Build Status](https://ci.webkom.dev/api/badges/webkom/nyitrondheim/status.svg)](https://ci.webkom.dev/webkom/nyitrondheim)

Use [Sanity](https://www.sanity.io/) to provide useful information to new students in Trondheim

## Setup

```bash
# Config
$ cp .env.example .env # Make a copy of the config file
# Log on to sanity.io, find the `project id` for the .env file

# Start server
$ yarn # install
$ yarn dev # run
```

Nice! The server is now available on `localhost:3000`. Sanity Studio is available at `localhost:3000/studio`.

This project uses prettier and eslint.

```bash
$ yarn lint # Check linting
$ yarn prettier # Format all files with prettier
```
