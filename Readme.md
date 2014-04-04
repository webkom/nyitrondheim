## Ny i Trondheim

Ny I Trondheim is built using [Node.js](http://nodejs.org/), [express](http://expressjs.com/) and [AngularJS](http://angularjs.org/).

To install a fresh clone, you must have node, npm and bower installed then run
```bash
$ make install
$ make
```

Bower can be installed via `npm install -g bower`.

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
