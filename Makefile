
build: less
	@:

less_files := strider.less config.less build.less dashboard.less projects.less
css_files := $(patsubst %.less,public/stylesheets/css/%.css,$(less_files))

less: $(css_files)

public/stylesheets/css/%.css: public/stylesheets/less/%.less
	./node_modules/.bin/lessc $< > $@

watch:
	watch make

serve:
	@./bin/strider

test: lint
	@./node_modules/.bin/mocha -R tap test/test_middleware.js
	@./node_modules/.bin/mocha -R tap test/test_ansi.js
	@./node_modules/.bin/mocha -R tap test/test_api.js
	@./node_modules/.bin/mocha -R tap test/functional/test.js

test-sauce:
	# note: you need sauce connect running, and the env variables
	# SAUCE_USERNAME and SAUCE_API_KEY
	mocha-selenium -c test/client/selenium.json -e sauce -p

test-selenium:
	# test locally. This will start up chromedriver for you
	mocha-selenium -c test/client/selenium.json

tolint := *.js *.json lib routes public/javascripts/pages public/javascripts/modules

lint:
	@./node_modules/.bin/jshint --verbose $(tolint)

strider_sub := strider-env strider-simple-worker strider-python strider-sauce strider-custom

link:
	npm link $(strider_sub)

unlink:
	npm install $(strider_sub)

.PHONY: test lint watch build less
