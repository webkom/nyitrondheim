BIN = node_modules/.bin
BROWSERIFY = $(BIN)/browserify
UGLIFY = $(BIN)/uglifyjs
SUPERVISOR = $(BIN)/supervisor
STYLUS = $(BIN)/stylus
UGLIFY = $(BIN)/uglifyjs
MOCHA = $(BIN)/mocha
JSHINT = $(BIN)/jshint

MONGO_URL = mongodb://localhost:27017/nit-test

STYL = $(shell find app/assets/css -name '*.styl')
JS = $(shell find app/assets/js -name '*.js')

VENDORCSS = \
	app/assets/vendor/fullcalendar/fullcalendar.css

VENDORJS = \
	app/assets/vendor/jquery/dist/jquery.js \
	app/assets/vendor/jquery-ui/ui/jquery-ui.js \
	app/assets/vendor/ng-file-upload/angular-file-upload-html5-shim.js \
	app/assets/vendor/angular/angular.min.js \
	app/assets/vendor/angular-i18n/angular-locale_no.js \
	app/assets/vendor/angular-local-storage/angular-local-storage.min.js \
	app/assets/vendor/angular-route/angular-route.min.js \
	app/assets/vendor/lodash/dist/lodash.min.js \
	app/assets/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js \
	app/assets/vendor/fullcalendar/fullcalendar.js \
	app/assets/vendor/angular-ui-calendar/src/calendar.js \
	app/assets/vendor/textAngular/textAngular-sanitize.js \
	app/assets/vendor/textAngular/textAngular.js \
	app/assets/vendor/momentjs/min/moment.min.js \
	app/assets/vendor/ng-file-upload/angular-file-upload.js

DIST = public

all: $(DIST)/vendor.js $(DIST)/app.js $(DIST)/vendor.css $(DIST)/app.css

ifneq ($(NODE_ENV), development)

$(DIST)/vendor.js: $(VENDORJS)
	cat $(VENDORJS) | $(UGLIFY) > $(DIST)/vendor.js

$(DIST)/app.js: $(JS)
	$(BROWSERIFY) app/assets/js/app.js | $(UGLIFY) > $(DIST)/app.js

$(DIST)/vendor.css: $(VENDORCSS)
	cat $(VENDORCSS) > $(DIST)/vendor.css

$(DIST)/app.css: $(STYL)
	$(STYLUS) --compress --include node_modules/nib/lib < app/assets/css/style.styl > $(DIST)/app.css

else

$(DIST)/vendor.js: $(VENDORJS)
	cat $(VENDORJS) > $(DIST)/vendor.js

$(DIST)/app.js: $(JS)
	$(BROWSERIFY) -d app/assets/js/app.js -o $(DIST)/app.js

$(DIST)/vendor.css: $(VENDORCSS)
	cat $(VENDORCSS) > $(DIST)/vendor.css

$(DIST)/app.css: $(STYL)
	$(STYLUS) --include node_modules/nib/lib < app/assets/css/style.styl > $(DIST)/app.css

endif

jshint:
	$(JSHINT) .

install:
	npm install
	bower install

reset:
	git fetch && git reset --hard origin/master

production: reset install all
	forever restart $(PWD)/index.js

server:
	$(SUPERVISOR) index.js

clean:
	rm -f $(DIST)/app.js $(DIST)/app.css $(DIST)/vendor.js $(DIST)/vendor.css

mocha:
	MONGO_URL=$(MONGO_URL) $(BIN)/mocha --colors

lint:
	@make jshint

test:
	@make lint && make mocha

.PHONY: all clean test server install reset production jshint lint mocha
