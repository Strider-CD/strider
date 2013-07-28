
build: less
	@:

less_files := strider.less config.less
css_files := $(patsubst %.less,public/stylesheets/css/%.css,$(less_files))

less: $(css_files)

public/stylesheets/css/%.css: public/stylesheets/less/%.less
	./node_modules/.bin/lessc $< > $@

watch:
	watch make

serve:
	@./bin/strider

test: lint
	@./node_modules/.bin/mocha -R tap
	@./node_modules/.bin/mocha -R tap test/functional/test.js

lint:
	@./node_modules/.bin/jshint *.js

strider_sub := strider-env strider-simple-worker strider-python strider-sauce strider-custom

link:
	npm link $(strider_sub)

unlink:
	npm install $(strider_sub)

.PHONY: test lint watch build less
