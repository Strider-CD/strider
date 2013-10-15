has_sauce := $(SAUCE_USERNAME)
ifndef has_sauce
test-env := test-local
else
test-env := test-sauce
endif



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

serve-test:
	@./bin/strider --config test/test-config.json


## ================= Test Suite ====================================

test: test-syntax test-smoke test-unit test-browser

test-smoke:
	# TODO Smoke tests should fail _fast_ on silly errors.


test-unit:
	@./node_modules/.bin/mocha -R tap test/unit/test_middleware.js
	@./node_modules/.bin/mocha -R tap test/unit/test_ansi.js
	@./node_modules/.bin/mocha -R tap test/unit/test_api.js

# Either test-local or test-sauce
test-browser: $(test-env)

# ===== SAUCE:

test-sauce: test-sauce-pre test-client-sauce test-integration-sauce

test-sauce-pre:
ifndef SAUCE_ACCESS_KEY
	$(error You need env: SAUCE_ACCESS_KEY)
endif
	# Sauce Connect: https://saucelabs.com/docs/connect
	# USER: $(SAUCE_USERNAME)
	# KEY:  $(SAUCE_ACCESS_KEY)

test-integration-sauce:
	./node_modules/mocha-selenium/bin/mocha-selenium.js -c test/selenium.json -p -e sauce test/integration/*_test.js

test-client-sauce:
	./node_modules/mocha-selenium/bin/mocha-selenium.js -c test/selenium.json -p -e sauce test/client/dashboard.js test/client/projects.js

# ====== LOCAL:

test-local: test-client-local test-integration-local
	$(which chromedriver)

test-client-local:
	./node_modules/.bin/mocha test/client/

test-integration-local:
	./node_modules/.bin/mocha test/integration/



test-syntax: lint

tolint := *.js *.json lib routes public/javascripts/pages public/javascripts/modules

lint:
	@./node_modules/.bin/jshint --verbose $(tolint)

strider_sub := strider-env strider-simple-worker strider-python strider-sauce strider-custom

link:
	npm link $(strider_sub)

unlink:
	npm install $(strider_sub)

authors-list:
	git shortlog -e -n -s $$commit | awk '{ args[NR] = $$0; sum += $$0 } END { for (i = 1; i <= NR; ++i) { printf "%-60s %2.1f%%\n", args[i], 100 * args[i] / sum } }' > AUTHORS

.PHONY: test lint watch build less
