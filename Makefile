
build: less
	@:

less_files := strider.less
css_files := $(patsubst %.less,public/stylesheets/css/%.css,$(less_files))

less: $(css_files)

public/stylesheets/css/%.css: public/stylesheets/less/%.less
	lessc $< > $@

watch:
	watch make

serve:
	@./bin/strider

test: lint
	@./node_modules/.bin/mocha -R tap
	@./node_modules/.bin/mocha -R tap test/functional/test.js

lint:
	@./node_modules/.bin/jshint *.js

.PHONY: test lint watch
