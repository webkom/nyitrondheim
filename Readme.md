## [Ny i Trondheim](http://nyitrondheim.no)
[![Build Status](https://travis-ci.org/webkom/nyitrondheim.svg)](https://travis-ci.org/webkom/nyitrondheim) [![Dependency Status](https://david-dm.org/webkom/nyitrondheim.svg)](https://david-dm.org/webkom/nyitrondheim)

Ny i Trondheim is built using [Node.js](http://nodejs.org/), [express](http://expressjs.com/) and [AngularJS](http://angularjs.org/).

To install a fresh clone, you must have node, npm and bower installed then run
```bash
$ make install
$ make
```

Bower can be installed via `npm install -g bower`. 

The project also relies on [gm](https://github.com/aheckmann/gm), which means you'll have to have either GraphicsMagick or ImageMagick installed for everything to work correctly.

In addition you'll need to have MongoDB running. You can set the database information through `export MONGO_URL="mongodb://localhost:PORT/DATABASENAME"`.

When the installation has finished, you can run
```bash
$ make server
```

to fire up a development server on [localhost:3000](http://localhost:3000).

## Build assets (CSS/JS)
To build JavaScript and CSS files you must run
```bash
$ make
```
every time you change something. If you hate doing this, you can use something like [watch](https://github.com/visionmedia/watch) to periodically run it (won't do anything useful unless files actually have changed).


## Tests
Run the tests with
```bash
$ make test
```
