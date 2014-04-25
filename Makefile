STYL=$(shell find app/assets/css -name '*.styl')
JS=$(shell find app/assets/js -name '*.js')

BIN=node_modules/.bin
VENDORJS=$(shell echo app/assets/vendor/{angular/angular.min.js,angular-local-storage/angular-local-storage.min.js,angular-route/angular-route.min.js,angular-resource/angular-resource.min.js,angular-animate/angular-animate.js,lodash/dist/lodash.min.js,scheduler/sources/dhtmlxscheduler.js,scheduler/sources/locale/locale_nb.js})
VENDORCSS=$(shell echo app/assets/vendor/{animate.css/animate.min.css,scheduler/sources/dhtmlxscheduler.css})

# Where build files should be stored
DIST=public

all: $(DIST)/vendor.js $(DIST)/app.js $(DIST)/vendor.css $(DIST)/app.css

$(DIST)/vendor.js: $(VENDORJS)
	cat $(VENDORJS) > $(DIST)/vendor.js

$(DIST)/app.js: $(JS)
	$(BIN)/browserify app/assets/js/app.js -o $(DIST)/app.js

$(DIST)/vendor.css: $(VENDORCSS)
	cat $(VENDORCSS) > $(DIST)/vendor.css

$(DIST)/app.css: $(STYL)
	$(BIN)/stylus < app/assets/css/style.styl --include node_modules/nib/lib > $(DIST)/app.css

install:
	npm install
	bower install

server:
	$(BIN)/supervisor index.js

clean:
	rm -f $(DIST)/app.js $(DIST)/app.css $(DIST)/vendor.js $(DIST)/vendor.css

test:
	$(BIN)/mocha --colors --reporter nyan

.PHONY: all clean test server install
