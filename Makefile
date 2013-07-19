
serve:
	@./bin/strider

test: lint
	@./node_modules/.bin/mocha -R tap
	@./node_modules/.bin/mocha -R tap test/functional/test.js

lint:
	@./node_modules/.bin/jshint *.js

.PHONY: test lint
