STYL=$(shell find public -name *.styl)
JADE=$(shell find public -name "*.jade")
HTML=$(JADE:.jade=.html)

all: $(HTML) public/style.css

public/style.css: $(STYL)
	stylus < public/style.styl --include /usr/local/share/npm/lib/node_modules/nib/lib > public/style.css

%.html: %.jade
	jade --pretty < $< > $@

install:
	npm install
	bower install

server:
	node_modules/.bin/supervisor index.js

clean:
	rm -f $(HTML)

test:
	mocha --colors --reporter list

.PHONY: clean test server install
