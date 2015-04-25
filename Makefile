BIN = node_modules/.bin
BOWER = $(BIN)/bower
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
	public/vendor/fullcalendar/fullcalendar.css

VENDORJS = \
	public/vendor/jquery/dist/jquery.js \
	public/vendor/jquery-ui/ui/jquery-ui.js \
	public/vendor/ng-file-upload/angular-file-upload-html5-shim.js \
	public/vendor/angular/angular.min.js \
	public/vendor/angular-i18n/angular-locale_no.js \
	public/vendor/angular-local-storage/angular-local-storage.min.js \
	public/vendor/angular-route/angular-route.min.js \
	public/vendor/lodash/dist/lodash.min.js \
	public/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js \
	public/vendor/fullcalendar/fullcalendar.js \
	public/vendor/angular-ui-calendar/src/calendar.js \
	public/vendor/textAngular/textAngular-sanitize.js \
	public/vendor/textAngular/textAngular.js \
	public/vendor/momentjs/min/moment.min.js \
	public/vendor/ng-file-upload/angular-file-upload.js

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
	$(BOWER) install --allow-root

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
