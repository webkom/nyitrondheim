## [Ny i Trondheim](http://nyitrondheim.no)

[![CircleCI](https://circleci.com/gh/webkom/nyitrondheim.svg?style=svg)](https://circleci.com/gh/webkom/nyitrondheim)

Ny i Trondheim is built using [Node.js](http://nodejs.org/), [express](http://expressjs.com/) and [AngularJS](http://angularjs.org/).

To install a fresh clone, you must have node, npm and bower installed then run

```bash
$ make install-deps
$ make
```

Bower can be installed via `npm install -g bower`.

The project also relies on [gm](https://github.com/aheckmann/gm), which means you'll have to have either GraphicsMagick or ImageMagick installed for everything to work correctly.

In addition you'll need to have MongoDB running. You can set the database information through `export MONGO_URL="mongodb://localhost:PORT/DATABASENAME"`.

For development purposes, the MongoDB database can be started via docker-compose. You can run

```bash
$ docker-compose up
```

to start a MongoDB instance. When using docker-compose, you don't have to explicitly set the `MONGO_URL`

When the installation has finished, you can run

```bash
$ yarn start
```

to fire up a development server on [localhost:3000](http://localhost:3000).

## Fixtures

To load development fixtures, run the following commands

```bash
$ yarn fixtures:all
```

For more information about the fixture loading, run

```bash
$ yarn fixtures -h
```

The admin user is named `generelt`, and all development unions are loaded with
the default password `temp`.

## Build assets (CSS/JS)

To build JavaScript and CSS files you must run

```bash
$ make
```

every time you change something. If you hate doing this, you can use something like [watch](https://github.com/visionmedia/watch) to periodically run it (won't do anything useful unless files actually have changed).

## Tests

Run the tests with

```bash
$ yarn lint
$ yarn test
```
